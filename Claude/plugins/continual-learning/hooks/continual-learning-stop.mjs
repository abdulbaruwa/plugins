// Stop hook for continual learning. Counts completed turns and, once enough
// turns and time have passed and the transcript has grown, keeps the turn going
// with a request to run the memory updater.
//
// Input:  { "session_id", "transcript_path", "cwd", "stop_hook_active", ...common }
// State:  $CLAUDE_PLUGIN_DATA/state/<project-slug>.json (cadence), <project>/.claude/hooks/state/continual-learning-index.json (index)
// Output: { "decision": "block", "reason": "<text>" } to trigger, or {} otherwise

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DEFAULT_MIN_TURNS = 10;
const DEFAULT_MIN_MINUTES = 120;
const TRIAL_DEFAULT_MIN_TURNS = 3;
const TRIAL_DEFAULT_MIN_MINUTES = 15;
const TRIAL_DEFAULT_DURATION_MINUTES = 24 * 60;

function followupMessage(transcriptsDir, indexPath) {
  return `Run continual learning now: spawn the \`continual-learning:agents-memory-updater\` agent for the full memory update flow. This project's transcripts are the \`*.jsonl\` files in \`${transcriptsDir}\`. Use incremental transcript processing with index file \`${indexPath}\`: only consider transcripts not in the index or transcripts whose mtime is newer than indexed mtime. Have the agent refresh index mtimes, remove entries for deleted transcripts, and update the project's instruction file (\`CLAUDE.md\`, or \`AGENTS.md\` when the repo has no \`CLAUDE.md\`) only for high-signal recurring user corrections and durable workspace facts. Exclude one-off/transient details and secrets. If no meaningful updates exist, respond exactly: No high-signal memory updates.`;
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value) {
  return ["1", "true", "yes", "on"].includes((value ?? "").trim().toLowerCase());
}

function readEnvValue(primary, legacy) {
  return process.env[primary] ?? process.env[legacy];
}

function finiteOr(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function loadState(statePath) {
  const fallback = { version: 1, lastRunAtMs: 0, turnsSinceLastRun: 0, lastTranscriptMtimeMs: null, trialStartedAtMs: null };
  if (!existsSync(statePath)) return fallback;
  try {
    const parsed = JSON.parse(readFileSync(statePath, "utf-8"));
    if (parsed.version !== 1) return fallback;
    return {
      version: 1,
      lastRunAtMs: finiteOr(parsed.lastRunAtMs, 0),
      turnsSinceLastRun: Math.max(0, finiteOr(parsed.turnsSinceLastRun, 0)),
      lastTranscriptMtimeMs: finiteOr(parsed.lastTranscriptMtimeMs, null),
      trialStartedAtMs: finiteOr(parsed.trialStartedAtMs, null),
    };
  } catch {
    return fallback;
  }
}

function saveState(statePath, state) {
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function transcriptMtimeMs(transcriptPath) {
  try {
    return transcriptPath ? statSync(transcriptPath).mtimeMs : null;
  } catch {
    return null;
  }
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

async function main() {
  const input = JSON.parse(await readStdin());
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
  // Cadence state goes in the plugin's data dir, keyed by project, so the hook does not
  // write into every project on every turn. The index stays in the project: the
  // memory updater edits it there.
  const dataDir = process.env.CLAUDE_PLUGIN_DATA;
  const statePath = dataDir
    ? resolve(dataDir, "state", `${projectDir.replace(/[^A-Za-z0-9]/g, "-")}.json`)
    : resolve(projectDir, ".claude/hooks/state/continual-learning.json");
  const indexPath = resolve(projectDir, ".claude/hooks/state/continual-learning-index.json");
  const state = loadState(statePath);

  // A Stop that follows a hook-requested continuation is not a new user turn.
  const countedTurn = input.stop_hook_active !== true;
  const turnsSinceLastRun = state.turnsSinceLastRun + (countedTurn ? 1 : 0);
  const now = Date.now();

  const trialEnabled = parseBoolean(readEnvValue("CONTINUAL_LEARNING_TRIAL_MODE", "CONTINUOUS_LEARNING_TRIAL_MODE"));
  if (trialEnabled && countedTurn && state.trialStartedAtMs === null) state.trialStartedAtMs = now;

  const trialDurationMinutes = parsePositiveInt(
    readEnvValue("CONTINUAL_LEARNING_TRIAL_DURATION_MINUTES", "CONTINUOUS_LEARNING_TRIAL_DURATION_MINUTES"),
    TRIAL_DEFAULT_DURATION_MINUTES,
  );
  const inTrialWindow =
    trialEnabled && state.trialStartedAtMs !== null && now - state.trialStartedAtMs < trialDurationMinutes * 60_000;

  const minTurns = inTrialWindow
    ? parsePositiveInt(readEnvValue("CONTINUAL_LEARNING_TRIAL_MIN_TURNS", "CONTINUOUS_LEARNING_TRIAL_MIN_TURNS"), TRIAL_DEFAULT_MIN_TURNS)
    : parsePositiveInt(readEnvValue("CONTINUAL_LEARNING_MIN_TURNS", "CONTINUOUS_LEARNING_MIN_TURNS"), DEFAULT_MIN_TURNS);
  const minMinutes = inTrialWindow
    ? parsePositiveInt(readEnvValue("CONTINUAL_LEARNING_TRIAL_MIN_MINUTES", "CONTINUOUS_LEARNING_TRIAL_MIN_MINUTES"), TRIAL_DEFAULT_MIN_MINUTES)
    : parsePositiveInt(readEnvValue("CONTINUAL_LEARNING_MIN_MINUTES", "CONTINUOUS_LEARNING_MIN_MINUTES"), DEFAULT_MIN_MINUTES);

  const minutesSinceLastRun = state.lastRunAtMs > 0 ? Math.floor((now - state.lastRunAtMs) / 60_000) : Number.POSITIVE_INFINITY;
  const mtime = transcriptMtimeMs(input.transcript_path);
  const transcriptAdvanced = mtime !== null && (state.lastTranscriptMtimeMs === null || mtime > state.lastTranscriptMtimeMs);

  if (countedTurn && turnsSinceLastRun >= minTurns && minutesSinceLastRun >= minMinutes && transcriptAdvanced) {
    saveState(statePath, { ...state, lastRunAtMs: now, turnsSinceLastRun: 0, lastTranscriptMtimeMs: mtime });
    console.log(JSON.stringify({ decision: "block", reason: followupMessage(dirname(input.transcript_path), indexPath) }));
    return;
  }

  saveState(statePath, { ...state, turnsSinceLastRun });
  console.log(JSON.stringify({}));
}

main().catch((error) => {
  console.error("[continual-learning-stop] failed", error);
  console.log(JSON.stringify({}));
});
