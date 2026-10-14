# Continual Learning

Automatically and incrementally keeps the project's instruction file up to date from Claude Code session transcripts. The file is `CLAUDE.md` when the repo has one, and `AGENTS.md` otherwise, because Claude Code reads `AGENTS.md` only when there is no `CLAUDE.md`.

The plugin combines:

- A `Stop` hook (Node) that decides when to trigger learning.
- A `continual-learning` skill (`/continual-learning:continual-learning`) for running the flow by hand.
- A `continual-learning:agents-memory-updater` subagent that mines new or changed transcripts and updates the instruction file.

It is designed to avoid noisy rewrites by:

- Reading the existing file first and updating matching bullets in place.
- Processing only new or changed transcript files.
- Writing plain bullet points only (no evidence/confidence metadata).

## Installation

```text
/plugin marketplace add <path-to-repo>/Claude
/plugin install continual-learning@cursor-plugins-claude
```

The hook needs `node` on `PATH`.

## How it works

On eligible `Stop` events, the hook keeps the turn going (`{"decision": "block"}`) with a request to spawn `continual-learning:agents-memory-updater`. The request names this project's transcript directory (`~/.claude/projects/<project-slug>/`, taken from the hook's `transcript_path`) and the index file. Stops that follow a hook-requested continuation do not count as turns.

The skill is marked `disable-model-invocation: true`, so Claude never picks it on its own; type it to run the flow now. It delegates the full memory update flow to the same subagent.

The hook keeps its cadence state in the plugin's data directory (`~/.claude/plugins/data/<plugin>/state/<project-slug>.json`), so it writes nothing into a project until learning runs.

The updater keeps an incremental transcript index in the project at:

- `.claude/hooks/state/continual-learning-index.json`

Add `.claude/hooks/state/` to your `.gitignore`.

## Trigger cadence

Default cadence:

- minimum 10 completed turns
- minimum 120 minutes since the last run
- transcript mtime must advance since the previous run

Trial mode is off unless `CONTINUAL_LEARNING_TRIAL_MODE=1` is set. Its defaults:

- minimum 3 completed turns
- minimum 15 minutes
- automatically expires after 24 hours, then falls back to the default cadence

## Optional env overrides

- `CONTINUAL_LEARNING_MIN_TURNS` (or legacy `CONTINUOUS_LEARNING_MIN_TURNS`)
- `CONTINUAL_LEARNING_MIN_MINUTES` (or legacy `CONTINUOUS_LEARNING_MIN_MINUTES`)
- `CONTINUAL_LEARNING_TRIAL_MODE` (or legacy `CONTINUOUS_LEARNING_TRIAL_MODE`)
- `CONTINUAL_LEARNING_TRIAL_MIN_TURNS` (or legacy `CONTINUOUS_LEARNING_TRIAL_MIN_TURNS`)
- `CONTINUAL_LEARNING_TRIAL_MIN_MINUTES` (or legacy `CONTINUOUS_LEARNING_TRIAL_MIN_MINUTES`)
- `CONTINUAL_LEARNING_TRIAL_DURATION_MINUTES` (or legacy `CONTINUOUS_LEARNING_TRIAL_DURATION_MINUTES`)

Set them in the shell that launches Claude Code, or under `env` in `~/.claude/settings.json`.

## Output format

The memory updater writes only these sections, leaving the rest of the file untouched:

- `## Learned User Preferences`
- `## Learned Workspace Facts`

Each item is a plain bullet point.

## License

MIT
