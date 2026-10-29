// Porting decisions for the Claude Code build. build.mjs reads this file.
//
// Each Cursor plugin listed in ../../.cursor-plugin/marketplace.json is ported
// unless SKIP or MANUAL_MCP names it. Per-plugin settings live in PLUGINS.

export const MARKETPLACE = {
  name: "cursor-plugins-claude",
  owner: { name: "abdulbaruwa" },
  description:
    "Claude Code port of the Cursor plugin marketplace (github.com/cursor/plugins): developer workflows, agent skills, and MCP integrations.",
};

// Fixed OAuth callback port. Upstream READMEs already ask admins to allow
// http://localhost:8787/callback, which is also Claude Code's redirect on this port.
export const OAUTH_CALLBACK_PORT = 8787;

const CURSOR_HOSTED = "The MCP server is Cursor's hosted proxy (`api.cursor.com/rest-mcp`), which needs a Cursor account.";

// Plugins left out of the Claude marketplace, with the reason shown in Claude/README.md.
export const SKIP = {
  "ralph-loop":
    "Claude Code's official marketplace has a `ralph-loop` plugin for the same workflow. Install that one: `/plugin install ralph-loop@claude-plugins-official`.",
  finance: "Grok Bot only (`minClientVersions.cursor` is `never`).",
  "shopify-store": "Grok Bot only (`minClientVersions.cursor` is `never`).",
  tailscale: "Grok Bot only: joins Grok Bot to a tailnet.",
  gopuff: "Grok Bot only, with a fixed mcp-grok-bot OAuth client; no supported Claude Code registration is supplied.",
  "x-money": "Grok Bot only (`minClientVersions.cursor` is `never`).",
  workday: "No MCP config in the Cursor plugin; Cursor wires the server up on its side.",
  "whatsapp-business": "Metadata only; no MCP endpoint or implementation is supplied.",
  "zoho-books": "Metadata only; no MCP endpoint or implementation is supplied.",
  "zoho-crm": "Metadata only; no MCP endpoint or implementation is supplied.",
  "zoho-desk": "Metadata only; no MCP endpoint or implementation is supplied.",
  zoom: "Zoom accepts only a `127.0.0.1` loopback redirect and rejects `localhost`, and Claude Code always signs in through `http://localhost:<port>/callback`.",
  "google-docs": CURSOR_HOSTED,
  "google-ads": CURSOR_HOSTED,
  "power-bi": "Grok Bot only and backed by Cursor's hosted REST MCP proxy; no native provider endpoint is supplied.",
  "google-drive": CURSOR_HOSTED,
  "google-sheets": CURSOR_HOSTED,
  "google-slides": CURSOR_HOSTED,
  onedrive: CURSOR_HOSTED,
  outlook: CURSOR_HOSTED,
  "outlook-calendar": CURSOR_HOSTED,
  sharepoint: CURSOR_HOSTED,
  teams: CURSOR_HOSTED,
};

// Servers excluded from automatic packaging until their endpoint, registration,
// redirect, or secret requirements are configured and verified. Some support DCR;
// others require an OAuth client of your own. Claude Code reads client secrets only
// from `claude mcp add --client-secret` (or MCP_CLIENT_SECRET), never from a plugin.
// Claude/README.md prints provider-specific qualifications and manual templates.
//   why     shown in the README
//   secret  whether the provider's client needs a secret (default: the Cursor config has CLIENT_SECRET)
export const MANUAL_MCP = {
  "databricks-genie-one": { why: "Requires your bare workspace hostname and a registered Databricks client ID; dynamic registration is unsupported. Preserve ai-gateway/offline_access scopes and verify native redirect support. A secret is optional, not required.", secret: false },
  "jobber": { why: "Requires your own Jobber OAuth client ID and secret with the native redirect registered. Clients, requests, and quotes are writable; jobs, invoices, and visits are read-only." },
  "vanta": { why: "Select mcp.vanta.com (US), mcp.eu.vanta.com (Europe), or mcp.aus.vanta.com (Australia) before adding the server. No region is inferred. Verify provider-supported dynamic registration and native redirect/tool access; connectivity is unverified.", secret: false },
  "highlevel": { why: "Upstream uses a client-specific Cursor v2 endpoint. This recipe selects the separately documented universal endpoint, with fewer tools; verify provider-supported client registration, redirect support, and the required tools before adding it.", url: "https://services.leadconnectorhq.com/mcp/", secret: false },
  "meta-ads": { why: "Upstream uses Cursor's registered Meta app ID and no dynamic client registration. Register a Meta OAuth client with your own allowed redirect URI; do not reuse Cursor's app ID.", secret: false },
  "quickbooks-online": { why: "Intuit now publishes an MCP endpoint, but the upstream setup relies on Cursor-owned OAuth credentials. Verify provider-supported Claude Code client registration and redirect support first; connectivity is unverified.", secret: false },
  docusign: { why: "Needs your own Docusign integration key and secret." },
  gong: { why: "Needs your own Gong OAuth client ID and secret." },
  hubspot: { why: "Needs your own HubSpot app client ID and secret." },
  gmail: { why: "Google offers no dynamic client registration. Create a Desktop OAuth client in Google Cloud with the Gmail API enabled.", secret: true },
  "google-calendar": { why: "Google offers no dynamic client registration. Create a Desktop OAuth client in Google Cloud with the Calendar API enabled.", secret: true },
  "google-cloud-bigquery": { why: "Upstream now requires a team-owned Google client ID and secret. Verify a provider-supported native app type, redirect, and BigQuery scope; Cursor's web-app callback and backend secret storage do not transfer. Queries may be billed to the selected project, and execute_sql can write when IAM permits.", secret: true },
  salesforce: { why: "Needs your org's MCP URL and an External Client App consumer key (Connected Apps are not supported; enable JWT-based access tokens)." },
  "salesforce-headless-360": { why: "Needs your org's MCP URL and an External Client App consumer key and secret (Connected Apps are not supported)." },
  x: { why: "X's MCP uses a fixed client ID whose allowed redirect URIs are not documented. Try X's client ID from the Cursor plugin's `mcp.json` first; if sign-in fails, register your own X app." },
  "x-ads": { why: "X's MCP uses a fixed client ID whose allowed redirect URIs are not documented. Try X's client ID from the Cursor plugin's `mcp.json` first; if sign-in fails, register your own X app." },
};

// Cursor agent `model:` values → Claude Code agent frontmatter.
export function mapAgentModel(value) {
  const effort = value.match(/\[effort=(\w+)\]/)?.[1];
  const base = value.replace(/\[.*\]$/, "");
  const withEffort = (model) => ({ model, ...(effort && { effort }) });
  if (base === "inherit") return withEffort("inherit");
  if (base === "fast") return withEffort("haiku");
  if (/^(grok|cursor-grok)/.test(base)) return withEffort("opus");
  if (/^(sonnet|opus|haiku|fable)$/.test(base) || /^claude-/.test(base)) return withEffort(base);
  return withEffort("inherit");
}

// Skill frontmatter keys that only Cursor reads (UI chrome and Custom Mode).
export const CURSOR_ONLY_SKILL_KEYS = ["icon", "color", "mode", "reminder"];

// Plugins in this marketplace, filled in by build.mjs before any rewrite runs.
export const ported = new Set();

function installCommand(name) {
  if (name === "<name>" || ported.has(name)) return `/plugin install ${name}@${MARKETPLACE.name}`;
  return `/plugin install ${name}`;
}

// Marks a `.cursor/` path that must survive the path rewrites (a read list that should
// still find a repo's existing Cursor files). build.mjs strips it after rewriting.
export const KEEP = "@@keep@@";

// Text rewrites for Markdown files, grouped so a plugin can opt out of a group.
// They run in order, after patches. Agent names are namespaced afterwards (build.mjs).
export const REWRITE_SETS = {
  env: [
    [/\bCURSOR_PLUGIN_ROOT\b/g, "CLAUDE_PLUGIN_ROOT"],
    [/\bCURSOR_PROJECT_DIR\b/g, "CLAUDE_PROJECT_DIR"],
  ],
  tools: [
    [/\bAskQuestion\b/g, "AskUserQuestion"],
    [/You are a \*\*Task subagent\*\*/g, "You are a **subagent**"],
    [/\| Task subagent/g, "| Subagent"],
    [/\b([Aa]) Task (subagent|spawn)/g, "$1n Agent $2"],
    [/\b([Aa]) `Task`/g, "$1n `Agent`"],
    [/`Task`/g, "`Agent`"],
    [/\bTask tool\b/g, "Agent tool"],
    [/\bTask subagent/g, "Agent subagent"],
    [/\bTask spawn/g, "Agent spawn"],
    [/\bomit Task `model`/g, "omit Agent `model`"],
    [/\bInvoked via Task\b/g, "Invoked via the Agent tool"],
    [/\bfull Task schema\b/g, "full Agent schema"],
    [/\bTask response\b/g, "Agent response"],
    [/subagent_type: (["']?)explore\1(?![\w-])/g, "subagent_type: $1Explore$1"],
    [/subagent_type: (["']?)shell\1(?![\w-])/g, "subagent_type: $1general-purpose$1"],
    [/\bgeneralPurpose\b/g, "general-purpose"],
  ],
  install: [[/\/add-plugin ([\w<>-]+(?:\.[\w-]+)*)/g, (_, name) => installCommand(name)]],
  paths: [
    [/`AGENTS\.md`, `\.cursor\/rules\/`, `\.cursor\/skills\/`/g, `\`CLAUDE.md\` or \`AGENTS.md\`, \`.claude/rules/\` or \`${KEEP}.cursor/rules/\`, \`.claude/skills/\` or \`${KEEP}.cursor/skills/\``],
    [/`AGENTS\.md`, `\.cursor\/rules\/`/g, `\`CLAUDE.md\` or \`AGENTS.md\`, \`.claude/rules/\` or \`${KEEP}.cursor/rules/\``],
    [/~\/\.cursor\/projects\/<([^>]+)>\/agent-transcripts\/?/g, "~/.claude/projects/<$1>/"],
    [/(?<!@@keep@@)~\/\.cursor\/skills\//g, "~/.claude/skills/"],
    [/(?<!@@keep@@)~\/\.cursor\/plugins\//g, "~/.claude/plugins/"],
    [/(?<!@@keep@@)~\/\.cursor\/rules\//g, "~/.claude/rules/"],
    [/(?<!@@keep@@|~\/)\.cursor\/skills\//g, ".claude/skills/"],
    [/(?<!@@keep@@|~\/)\.cursor\/rules\//g, ".claude/rules/"],
    [/\.cursor\/advisor\b/g, ".claude/advisor"],
    [/\.cursor\/hooks\/state\b/g, ".claude/hooks/state"],
  ],
};

export const DEFAULT_REWRITE_SETS = ["env", "tools", "install", "paths"];

// Cursor routes pstack roles across Grok and Claude slugs with an effort suffix.
// Claude Code subagents take a model alias, so code roles go to sonnet and
// judgment/prose roles to opus; a second opinion pairs the two.
const PSTACK_MODELS = [
  [/\bclaude-opus-5-5-(?:max|xhigh|high|medium|low)(?![-\w])/g, "opus"],
  [/\bgrok-4\.7-(?:xhigh|high|medium|low)-fast(?![-\w])/g, "sonnet"],
];

const SLUG = "the absolute project path with every non-alphanumeric character as `-`";
const TRANSCRIPT_DIR = `\`~/.claude/projects/<project-slug>/\` (${SLUG}; sessions run in a worktree live under the worktree's own slug, \`<project-slug>--claude-worktrees-<name>\`; the current session's file is the one whose first user message matches this conversation's opening prompt`;

// Cursor runtime details pstack names inline: transcripts, Task parameters,
// /loop, restarts, cloud subagents, Custom Modes, the agent store, and the model rule.
const PSTACK_RUNTIME = [
  [/pstack-models\.mdc/g, "pstack-models.md"],
  [/~\/\.cursor\/projects\/\*\//g, "~/.claude/projects/*/"],
  [/The system prompt names the workspace's `agent-transcripts\/` directory\./g, `This project's transcripts are the \`*.jsonl\` files in ${TRANSCRIPT_DIR}).`],
  [/the active workspace's `agent-transcripts\/` directory \(the system prompt names (?:this|the) path/g, `this project's transcript directory, ${TRANSCRIPT_DIR}`],
  [/ and `readonly: true`\./g, ", briefed read-only: it must not edit files."],
  [/, `readonly: true`, and/g, ", a read-only brief (no file edits), and"],
  [/ with `readonly: false` \(agent mode\)\. \*\*Do not use readonly\/Ask mode\.\*\* It strips MCP access/g, ". **Do not use `Explore` or a tool allowlist that drops the `mcp__*` tools.** That strips MCP access"],
  [/, agent mode \(`readonly: false`\)/g, ""],
  [/, and readonly strips MCPs\./g, ". `general-purpose` keeps the MCP tools it needs."],
  [/agent mode \(readonly strips MCP\)/g, "an agent type that keeps MCP tools (`general-purpose` or `pstack:poteto-agent`)"],
  [/Use `environment: "local"` only when the worker needs access to something on the user's computer\./g, "Omit `isolation` only when the worker must work in the parent's checkout."],
  [/When a worker must start from a non-default pushed branch, pass `cloud_base_branch`\./g, "A worktree starts from the default branch, so a worker that must start from another pushed branch runs `git fetch origin <branch> && git checkout <branch>` first."],
  [/`environment: "cloud"`/g, '`isolation: "worktree"`'],
  [/full Agent schema including `environment`/g, "full Agent schema including `isolation`"],
  [/Agents are spawned, resumed, and drained only through the Agent tool\./g, "Agents are spawned with the Agent tool, continued with `SendMessage`, and drained from their completion notifications."],
  [/Every spawn and every resume carries the standing orders verbatim\./g, "Every spawn and every `SendMessage` continuation carries the standing orders verbatim."],
  [/Local spawns may reference the standing-orders file by store path\. Verbatim paste is for cloud spawns and every resume\./g, "Spawns may reference the standing-orders file by store path. Paste it verbatim into every `SendMessage` continuation."],
  [/local agents are dead, cloud work is not\./g, "every subagent is gone; worktrees, pushed branches, and PRs survive."],
  [/reattach cloud work by PR and branch/g, "reattach work by PR and branch"],
  [/Never resume an agent to check on it\. A resume restarts an idle agent\./g, "Never message an agent just to check on it. A `SendMessage` wakes an idle agent."],
  [/in the (?:current|root) agent's store \(path in the system prompt\)/g, "in a durable store outside the repo, `~/.claude/pstack/` (create it, and pass it to `orch` as `--store` or `ORCH_STORE`)"],
  [/Each owner is a Cursor cloud agent/g, 'Each owner is a local Claude Code subagent in its own worktree (`isolation: "worktree"`)'],
  [/Assume the VM dies\./g, "Assume the session ends; subagents stop, while worktrees, pushed branches, and PRs survive."],
  [/the agent store's `docs\/`/g, "the pstack store's `docs/` (`~/.claude/pstack/docs/`)"],
  [/the cloud agent's status in the Cursor dashboard/g, "the agent's last output"],
  [/on its own cloud VM at the PR head/g, "in its own worktree at the PR head"],
  [/4-6 options each, `allow_multiple: true`/g, 'up to 4 options each (the tool\'s limit; it adds an "Other" answer), `multiSelect: true`'],
  [/`git show origin\/main:pstack\/skills\/([^`]+)`/g, "`cat <pstack root>/skills/$1`"],
  [/(`|node )pstack\/skills\//g, "$1<pstack root>/skills/"],
  [/Cursor's `\/loop`/g, "Claude Code's `/loop`"],
  [/`\/loop` is Cursor's built-in wake mechanism/g, "`/loop` is Claude Code's built-in wake mechanism"],
  [/\b(a|After a) Cursor restart\b/g, "$1 Claude Code restart"],
  [/\brestart Cursor\b/g, "restart Claude Code"],
  [/Families go by prefix: `claude-\*`, and `grok-\*` with `cursor-grok-\*` and `composer-\*`\./g, "Models are the accepted aliases `opus`, `sonnet`, `haiku`, and `fable`; non-Claude source families map through this port's role defaults."],
  [/\.cursor\/worktrees\/myrepo\/x/g, ".claude/worktrees/x"],
  [/Cursor's built-in babysit skill/g, "any other installed babysit skill"],
  [/ or from Customize in the sidebar/g, " or from the `/plugin` browser"],
  [/, and mention once that a Custom Mode keeps it on\./g, "."],
  [/It was started with Enter\. Start it as a Custom Mode, or start each task with `\/poteto-mode`\./g, "Skills fade as the session grows. Start each task with `/pstack:poteto-mode`."],
  [/, or run them as cloud agents, which each get their own machine/g, ' (`isolation: "worktree"`)'],
  [/, as cloud agents \|/g, " |"],
  [/Run them as cloud agents, or say/g, "Say"],
  [/, cloud-agent URL,/g, ""],
  [/, and a Custom Mode keeps `\/poteto-mode` in context on every turn\. \[Set up pstack\]\(\.\/01-setup\.md#run-your-first-task\) shows how to start one\./g, ". Start each new task with `/pstack:poteto-mode`."],
  [/The cleanest isolation is a \[cloud subagent\]\([^)]*\)\.[^\n]*/g, 'Give each agent its own worktree (`isolation: "worktree"`) so they never share a working tree. They still share this machine\'s ports and build caches, so stagger anything that boots the app.'],
  [/an isolated worktree or cloud agent/g, "an isolated worktree"],
  [/A \[Cursor Project\]\(https:\/\/cursor\.com\/blog\/projects\)[^\n]*/g, "In Claude Code the coordinator is your session. Keep it open, or re-arm it with `/loop`, and it directs subagents that run in worktrees on this machine. Start your prompts to it with `/pstack:poteto-mode`, and the subagents it spawns follow the playbooks."],
  [/pstack ships this as a dormant \[automation pack\][^\n]*/g, "The Cursor version of pstack ships an automation pack for this. It is not part of the Claude Code port."],
  [/, and Projects and automations that scale past one agent\./g, "."],
  [/## Build a bot UI with `\/make-bot-ui`\n\n[^\n]*\n\n/g, ""],
  [/a chart or diagram from `\/visualize`/g, "a chart or diagram from a visualization tool, if the session has one"],
  [/and a `\/visualize` chart for numbers/g, "and a rendered chart for numbers"],
  [/, and resume one only in the strict cases/g, ", and continue one with `SendMessage` only in the strict cases"],
];

const SKILL_CREATOR = [
  [/Cursor's built-in `create-skill` flow/g, "a skill-authoring skill such as `skill-creator`"],
  [/Cursor's built-in `create-skill` skill/g, "a skill-authoring skill (such as `skill-creator`, if installed)"],
  [/Cursor's built-in `create-skill`/g, "a skill-authoring skill (such as `skill-creator`)"],
  [/\*\*create-skill\*\* skill \(Cursor's built-in for authoring SKILL\.md files\)/g, "**skill-creator** skill (Anthropic's skill-authoring skill, when installed)"],
  [/`create-skill`/g, "`skill-creator`"],
  [/\bvia create-skill\b/g, "via skill-creator"],
];

// reflect's reviewers decide a skill was "used" from transcript evidence; in Claude
// Code skills load through the Skill tool or a slash command, never a Read.
const REFLECT_EVIDENCE = [
  [
    /a `Read` of its `SKILL\.md` \(under `\.claude\/skills\/`, `~\/\.claude\/skills\/`, or `~\/\.claude\/plugins\/`\), an `Agent` prompt naming its path, or a tool call \(Shell, Grep, MCP, etc\.\)/g,
    "a `Skill` tool call or `<command-name>` slash invocation naming it, a `Read` of its `SKILL.md` (under `.claude/skills/`, `~/.claude/skills/`, or `~/.claude/plugins/`), an `Agent` prompt naming its path, or a tool call (Bash, Grep, MCP, etc.)",
  ],
];

const HTML_PAGE_SETUP =
  "Write one self-contained HTML file: inline CSS and JS, no build step, no network requests except an optional pinned CDN script. Support light and dark (`prefers-color-scheme`). Save it to `${TMPDIR:-/tmp}/<name>.html` unless the user names a path, then open it (`open` on macOS, `xdg-open` on Linux). If the session has an HTML preview or artifact tool, publish the file there instead.";
const CANVAS_SETUP =
  "Read `~/.cursor/skills-cursor/canvas/SKILL.md` first. It contains the generation policy, design guidance, slop rules, self-check, and file-path conventions you must follow. The full component and hook surface is declared in `~/.cursor/skills-cursor/canvas/sdk/index.d.ts` and its sibling `.d.ts` files — read them to discover exact exports and prop shapes rather than guessing.";
// Word-level canvas → page, leaving names like `pr-review-canvas`, paths, and <canvas> tags alone.
const CANVAS_WORDS = [
  [/Cursor Canvas/g, "HTML page"],
  [/(?<![-\w/<])canvas(?![-\w>.])/g, "page"],
  [/(?<![-\w/<])Canvas(?![-\w>.])/g, "Page"],
];

// Per-plugin settings:
//   rewriteSets  which REWRITE_SETS apply (default env, tools, install, paths)
//   rewrites     extra [pattern, replacement] pairs for this plugin's Markdown; each must
//                match somewhere in the plugin, or the build fails
//   patches      exact edits, { file, find, replace }, applied to the upstream text before
//                any rewrite; the build fails if `find` is missing, so drift surfaces
//   prepend      { file, text } notes inserted after the frontmatter and first heading
//   exclude      paths (relative to the plugin) left out of the port
//   skillIndex   list this plugin's user-only skills at session start so routed skills can be read
//   mcpOAuth     extra `oauth` fields for every server in the plugin's .mcp.json
//   notes        what differs from the Cursor version; shown in READMEs
export const PLUGINS = {
  advisor: {
    notes: [
      "Claude Code has a built-in advisor (`/advisor`) on the Anthropic API; prefer it there. This plugin runs as `/advisor:advisor` and suits Bedrock, Google Cloud, and Foundry, or when you want explicit checkpoints and a consult log.",
      "Hooks rewritten for Claude Code: `PostToolUse` marks edits, `SubagentStop` logs consults, `Stop` posts the pre-completion nudge. They need `jq`.",
      "The advisor subagent defaults to `opus` at `xhigh` effort. State lives in `.claude/advisor/`.",
    ],
  },
  "agent-compatibility": {
    notes: [
      "Review agents run on `haiku` (Cursor's `fast`) with file-writing tools disabled; they can still run shell commands.",
      "The published scanner checks Cursor files (`.cursor/rules`, `.cursor/mcp.json`); the review agent treats `CLAUDE.md`, `.claude/`, and `.mcp.json` as equivalents.",
    ],
    patches: [
      {
        file: "README.md",
        find: "If you want to use this plugin directly, symlink this directory into:\n\n```bash\n~/.cursor/plugins/local/agent-compatibility\n```",
        replace: "To try this plugin without installing it, run `claude --plugin-dir <path-to-this-folder>`.",
      },
      {
        file: "agents/compatibility-scan-review.md",
        find: "- Keep accelerator context separate from the deterministic compatibility score itself.",
        replace: "- Keep accelerator context separate from the deterministic compatibility score itself.\n- The scanner's accelerator checks look for Cursor files (`AGENTS.md`, `.cursor/rules`, `.cursor/skills`, `.cursor/mcp.json`). Treat `CLAUDE.md`, `.claude/rules/`, `.claude/skills/`, `.claude/agents/`, and `.mcp.json` as equivalents, and do not recommend adding Cursor-only files unless the repo already uses Cursor.",
      },
    ],
  },
  "cli-for-agent": { notes: [] },
  "continual-learning": {
    notes: [
      "The Stop hook runs on Node instead of Bun and keeps its cadence state in the plugin's data directory.",
      "Mines Claude Code transcripts (`~/.claude/projects/<slug>/*.jsonl`) and writes `CLAUDE.md`, or `AGENTS.md` when the repo has no `CLAUDE.md`.",
    ],
  },
  "create-plugin": {
    notes: ["Rewritten to scaffold and validate Claude Code plugins (`.claude-plugin/plugin.json`, `claude plugin init`, `claude plugin validate`)."],
  },
  "cursor-sdk": {
    rewriteSets: [],
    notes: ["Unchanged: teaches the `@cursor/sdk` TypeScript SDK. Code it writes needs a Cursor API key."],
  },
  "cursor-team-kit": {
    skillIndex: true,
    notes: [
      "Cursor's always-apply rules are injected by a `SessionStart` hook.",
      "`pr-review-canvas` uses an isolated run directory, accurate visible diffs, and a task-owned preview instead of Cursor's in-app browser.",
    ],
    patches: [
      {
        file: "skills/workflow-from-chats/SKILL.md",
        find: "recent Cursor chats",
        replace: "recent Claude Code sessions",
      },
      {
        file: "skills/workflow-from-chats/SKILL.md",
        find: "## Scope\n",
        replace: "## Scope\n\n- Transcripts are the `*.jsonl` files in `~/.claude/projects/<slug>/`, where the slug is the absolute project path with every non-alphanumeric character as `-` (`~/.claude/projects/*/` covers every project). The session id is the file name. Subagent transcripts are `<session-id>/subagents/agent-*.jsonl`, with a sibling `.meta.json` holding `agentType` and `description`.\n",
      },
      {
        file: "skills/loop-on-ci/SKILL.md",
        find: "4. If checks are pending, watch with `gh pr checks --watch --fail-fast`.",
        replace: "4. If checks are pending, watch with `gh pr checks --watch --fail-fast`. Run it as a background command (`run_in_background`) so it is not cut off by the shell timeout.",
      },
      {
        file: "agents/ci-watcher.md",
        find: "4. If checks are pending, watch: `gh pr checks --watch --fail-fast`",
        replace: "4. If checks are pending, watch: `gh pr checks --watch --fail-fast` (as a background command, so the shell timeout does not cut it off)",
      },
    ],
  },
  "docs-canvas": {
    notes: ["Renders a self-contained HTML page instead of a Cursor Canvas. The skill is still a placeholder upstream."],
    rewrites: CANVAS_WORDS,
    patches: [
      { file: "skills/docs-canvas/SKILL.md", find: CANVAS_SETUP, replace: HTML_PAGE_SETUP.replace("<name>", "docs-<slug>") },
      {
        file: "skills/docs-canvas/SKILL.md",
        find: "> **Status:** placeholder. The skill structure is in place so the canvas\n> welcome page can surface this plugin via the marketplace query, but the\n",
        replace: "> **Status:** placeholder. The skill structure is in place, but the\n",
      },
      {
        file: "skills/docs-canvas/SKILL.md",
        find: "## Render with canvas primitives\n\nPrefer built-in canvas components over raw HTML:",
        replace: "## Render with plain HTML\n\nUse semantic HTML, CSS, and inline SVG:",
      },
      {
        file: "skills/docs-canvas/SKILL.md",
        find: "Use diagrams (DAG layout, mermaid) for architecture.",
        replace: "Use inline SVG diagrams for architecture.",
      },
      {
        file: "README.md",
        find: "The skill structure is complete and the Canvas welcome page will surface it in the marketplace, but",
        replace: "The skill structure is complete, but",
      },
      { file: "README.md", find: "- Cursor with Canvas enabled.", replace: "- A browser to open the generated HTML file." },
    ],
  },
  "dyl-stack": {
    skillIndex: true,
    notes: [
      "Agent references are namespaced (`dyl-stack:dyl-agent`, `thermos:…`). Repo guidance reads `CLAUDE.md`/`AGENTS.md` and `.claude/rules/`/`.cursor/rules/`.",
      "Deep reviews use a `general-purpose` bug-hunting subagent in place of Cursor's Bugbot.",
      "Builds on pstack, thermos, and cursor-team-kit; install those too. `build-figma` also needs a Figma plugin (`/plugin install figma`).",
    ],
    rewrites: [
      [/\(`Agent` `model: inherit`, or omit `model`\)/g, "(omit `model` on the `Agent` call)"],
      [/; resume the existing one\./g, "; continue the existing one with `SendMessage`."],
      [/Resume an existing `dyl-agent` for the conversation/g, "Continue an existing `dyl-agent` for the conversation with `SendMessage`"],
      [/or resume the existing one\)/g, "or continue the existing one with `SendMessage`)"],
      [/Do not inline this skill into `general-purpose`\./g, "Do not inline this skill into `general-purpose`. Put the absolute paths of this skill's `SKILL.md` and pstack's `poteto-mode` `SKILL.md` (from the session-start notes) in the spawn prompt."],
    ],
    patches: [
      {
        file: "skills/dyl-review/SKILL.md",
        find: "plus exactly one `bugbot` subagent with `Diff: branch changes` (Cursor's built-in `/review-bugbot`)",
        replace: "plus exactly one Bugbot stand-in (Claude Code has no Cursor Bugbot): a `general-purpose` subagent given the branch diff (`git diff <base>...HEAD`) and a fixed prompt to find bugs, regressions, and security issues with `file:line` evidence and no style notes",
      },
      {
        file: "skills/dyl-review/SKILL.md",
        find: "- **Dyl-mode.** Read the `dyl-mode` skill's Dylan gates and pstack `poteto-mode`'s Principles index.",
        replace: "- **Dyl-mode.** Read the `dyl-mode` skill's Dylan gates and pstack `poteto-mode`'s Principles index, at the absolute paths the main thread passed (the main thread takes them from the session-start notes).",
      },
      {
        file: "skills/dyl-mode/references/requirements.md",
        find: "They sit beside `setup-pstack`: `<setup-pstack dir>/../poteto-mode/SKILL.md`, `../poteto-mode/playbooks/<name>.md`, `../principle-<name>/SKILL.md`, `../bro/SKILL.md`, `../unslop/SKILL.md`.",
        replace: "pstack's session-start note names its root: `<pstack root>/skills/poteto-mode/SKILL.md`, `<pstack root>/skills/poteto-mode/playbooks/<name>.md`, `<pstack root>/skills/principle-<name>/SKILL.md`, `<pstack root>/skills/bro/SKILL.md`, `<pstack root>/skills/unslop/SKILL.md`.",
      },
      {
        file: "skills/dyl-mode/references/requirements.md",
        find: "| `control-ui`, `verify-this`, and `deslop` are in your skill list | Their listed paths. |",
        replace: "| `control-ui`, `verify-this`, and `deslop` are in your skill list | Load them with the Skill tool (`cursor-team-kit:<name>`). |",
      },
      {
        file: "skills/dyl-mode/references/requirements.md",
        find: "| `figma` | `figma-design-to-code` is in your skill list and a Figma MCP tool call succeeds | Its listed path. |",
        replace: "| `figma` (from `claude-plugins-official`) | a Figma design-to-code skill is in your skill list and a Figma MCP tool call succeeds | Load it with the Skill tool. |",
      },
    ],
  },
  "grok-voice": {
    rewriteSets: [],
    notes: ["Unchanged: adds xAI Grok voice APIs to your app. Grok here is the product being integrated."],
  },
  orchestrate: {
    rewriteSets: ["env"],
    notes: [
      "Unchanged workflow: from Claude Code you act as the dispatcher, which kicks off a Cursor cloud planner through `@cursor/sdk`.",
      "Needs a Cursor account billed for cloud agents, `CURSOR_API_KEY`, `bun` on `PATH`, and `bun install` in the installed copy's `skills/orchestrate/scripts/` (again after each update). Install `cursor-sdk` too; the skill calls it required reading.",
    ],
    patches: [
      {
        file: "skills/orchestrate/SKILL.md",
        find: "**Dispatcher.** You're in a local IDE session and the user typed `/orchestrate <goal>`.",
        replace: "**Dispatcher.** You're in a local session (a Cursor IDE chat, or Claude Code with `/orchestrate:orchestrate <goal>`) and the user asked to orchestrate a goal.",
      },
    ],
  },
  "origin-apps": { rewriteSets: [], notes: ["Unchanged: Cursor Origin API skills."] },
  "pr-review-canvas": {
    notes: ["Renders a self-contained HTML review page in an isolated run directory with accurate visible diffs and a task-owned preview."],
  },
  pstack: {
    skillIndex: true,
    notes: [
      "Model roles map to Claude aliases: `sonnet` for code, `opus` for judgment and prose, both for second opinions. `/setup-pstack` writes `~/.claude/rules/pstack-models.md`.",
      "Cursor's cloud subagents become local subagents in worktrees, and `resume` becomes `SendMessage`. Playbooks that assumed one VM per lane (Orchestrate, Autopilot, Multi-phase plan) now share this machine's CPU and ports.",
      "Claude Code has no Custom Modes: start each task with `/pstack:poteto-mode`. The guide pages under `docs/guide/` still describe some Cursor UI.",
      "Leaves out the Cursor Automations pack (`automations/benny`) and `make-bot-ui` (Grok Bot webhooks).",
      "Adds about 3.5k tokens of always-on context per session (its skill list plus the hidden-skill note).",
    ],
    exclude: ["automations", "skills/make-bot-ui"],
    rewrites: [...PSTACK_MODELS, ...PSTACK_RUNTIME, ...SKILL_CREATOR, ...REFLECT_EVIDENCE],
    prepend: [
      { file: "skills/statechart/SKILL.md", text: "Use an owned scratch directory outside the repo, and preserve evidence before cleanup. Read ../../docs/harness/claude-code.md for native tool and explicit-only routing. The scripts may install pinned Pele/resvg into a cache and download TLC/Java through mise; inspect available dependencies and disclose downloads before running. No browser is required. A model or bounded result is not proof of the whole system." },
      { file: "skills/ketchup-video/SKILL.md", text: "Read the packaged ketchup skill by its absolute path when routing from this user-only skill. Use only rendering and artifact tools actually available in the session. Never claim a video or inspection without file evidence; use the stated failure path if rendering or attachment is unavailable." },
      {"file": "skills/poteto-mode/SKILL.md", "text": "Read ../../docs/harness/claude-code.md for this port's native tools, explicit-only skill routing, model fields, conversation identity, and prerequisite gates before following the runtime instructions below."},
      {"file": "skills/create-formal-verification-skill/SKILL.md", "text": "Run real-code negative controls in an isolated worktree or owned scratch checkout. Preserve unrelated changes, restore only your control edits, and retain evidence outside the disposable checkout. A generated-input fallback is testing, not a formal proof."},
      {"file": "skills/maintain-formal-verification-skill/SKILL.md", "text": "Run real-code negative controls in an isolated worktree or owned scratch checkout. Preserve unrelated changes, restore only your control edits, and retain evidence outside the disposable checkout. A generated-input fallback is testing, not a formal proof."},
      {"file": "skills/sharpen/SKILL.md", "text": "Keep the user's explicit scope, constraints, and approval gates. Propose changing a user-owned constraint instead of silently relaxing it."},
      {
        file: "skills/poteto-mode/playbooks/orchestrate.md",
        text: "> **Claude Code port.** This playbook was written for Cursor, where workers run as cloud agents on their own VMs and survive the coordinator. Here every worker is a local subagent in a worktree on this machine, and every subagent ends with the session; only worktrees, pushed branches, and PRs survive a restart. Read \"cloud\" below as \"worktree\", and size waves for one machine.",
      },
    ],
    patches: [
      {
        file: "README.md",
        find: "claude code leaves auto-update off for third-party marketplaces, so pstack stays on the version you installed. to turn it on, run `/plugin`, open the **marketplaces** tab, select `cursor-plugins`, and choose **enable auto-update**. to update once by hand, run `claude plugin update pstack@cursor-plugins`.",
        replace: "this community port uses `cursor-plugins-claude`. for a GitHub-backed installation, inspect its update setting in `/plugin` and update with `claude plugin update pstack@cursor-plugins-claude` when supported. for the documented local-clone installation, fetch and reconcile the repository, rebuild with `node Claude/scripts/build.mjs`, and reload plugins or start a new session. this does not install or update the separate upstream root marketplace.",
      },
      {
        file: "README.md",
        find: "in claude code:\n\n```bash\n/plugin marketplace add cursor/plugins\n/plugin install pstack@cursor-plugins\n```",
        replace: "in this community Claude Code port, from a clone of this repository:\n\n```bash\n/plugin marketplace add <path-to-repo>/Claude\n/plugin install pstack@cursor-plugins-claude\n```",
      },
      {
        file: "README.md",
        find: "claude code installs a generated copy of pstack, including this readme and the guide, from [`harness/pstack/`](https://github.com/cursor/plugins/tree/main/harness/pstack) at the repository root. after you change pstack, run `node scripts/generate-pstack-harness-trees.mjs` from the repository root and commit the result. ci fails while the generated copy is out of date.",
        replace: "this community port is generated under `Claude/plugins/pstack/`. maintain it through `Claude/scripts/port.config.mjs` and `Claude/overrides/pstack/`, then run `node Claude/scripts/build.mjs` from the repository root and commit the generated output. `node Claude/scripts/build.mjs --check` checks output and override locks; review changed sources before updating any lock. the separate upstream `harness/pstack/` tree is not this port.",
      },
      {"file": "skills/poteto-mode/SKILL.md", "find": "**Match the model to the job.** Before each spawn, start from the role's line or default and pick the reasoning level and speed the job needs. The `/setup-pstack` budget sets each role's starting level, xhigh by default. Raise it one step, up to max, for the hardest or subtlest work. Lower it one step for judgment and two or more steps for routine work. Use fast mode only when the job is urgent, meaning CI or trunk is red or a person is blocked on the result right now. Otherwise use standard speed, the same slug without `-fast`. Verification is the exception and stays on the `swarm workers` model and speed (`grok-4.7-xhigh-fast` by default). Change only the effort level and whether the slug is fast, and keep the family the role names, so a diverse panel stays diverse. If the family has no slug at that level and speed, use its nearest slug. A role on `auto` or `inherit-parent` stays on the parent model. If the Task tool rejects the adjusted slug, do not try another adjusted slug. Use the role's line or default and say so.", "replace": "**Match the model to the job.** Start from the configured role alias and budget. Keep `opus`, `sonnet`, `haiku`, `fable`, or inherited model selection; never construct aliases such as `sonnet-fast` or append an effort suffix. When the Agent tool exposes a separate `effort` parameter, choose a supported value for the task and honor the configured budget. Use a speed setting only when the actual session tool supports it. Omit unsupported fields and state the limitation. An inherited role remains inherited."},
      {"file": "docs/guide/01-setup.md", "find": "In Claude Code, run `/plugin marketplace add cursor/plugins`, then `/plugin install pstack@cursor-plugins`. Claude Code prefixes plugin commands, so each command in this guide takes a `pstack:` prefix there, such as `/pstack:setup-pstack`, which writes its model rule to `~/.claude/rules/pstack-models.md`. The [Claude Code adapter](../harness/claude-code.md) covers the other differences.", "replace": "Use the community marketplace installed above. Commands take a `pstack:` prefix, such as `/pstack:setup-pstack`, and the [native Claude Code adapter](../harness/claude-code.md) explains this port's routing and session boundaries."},
      {
        file: "skills/poteto-help/SKILL.md",
        find: "pstack is built for Cursor, and it also installs in Claude Code with `/plugin marketplace add cursor/plugins`, then `/plugin install pstack@cursor-plugins`. There, each command takes a `pstack:` prefix, such as `/pstack:poteto-mode`. The [Claude Code adapter](../../docs/harness/claude-code.md) maps the Cursor names, and a step that needs a Cursor-only feature, such as Bugbot or Automations, is skipped with a one-line note.\n\nOther tools can read the skills, because they use the Agent Skills format. But most workflow skills, including `/poteto-mode`, `/how`, `/why`, and `/teach`, spawn Cursor subagents with per-role models, and Custom Modes and `/loop` are Cursor features, so those parts may not work there.",
        replace: "This is the Claude Code port of pstack, which was built for Cursor. Workflow skills such as `/poteto-mode`, `/how`, `/why`, and `/teach` spawn Claude subagents with per-role models (`sonnet` for code and `opus` for judgment by default). Playbooks that fan out to Cursor cloud agents run as local subagents in worktrees here, and Cursor's Custom Modes have no Claude Code equivalent.",
      },
      {
        file: "skills/poteto-help/SKILL.md",
        find: "Whether `/poteto-mode` stays on depends on how the user starts it:\n\n- Enter on `/poteto-mode` attaches the skill to one message. It fades as the chat moves on.\n- Option+Enter on Mac or Alt+Enter on Windows, or Use as Mode from the skill entry, makes it a Custom Mode. It stays in context every turn until the user exits the mode, and it stays out of casual turns.\n- Cursor's docs list Custom Modes in the Agents Window and the CLI. Elsewhere, start each new task with `/poteto-mode`.\n\nLink [Cursor's skills docs](https://cursor.com/docs/skills) when this comes up.",
        replace: "`/pstack:poteto-mode` attaches the skill to one message, and it fades as the session moves on. Claude Code has no Custom Modes, so start each new task with it.\n\nLink [Claude Code's skills docs](https://code.claude.com/docs/en/skills) when this comes up.",
      },
      {
        file: "skills/poteto-help/SKILL.md",
        find: "| Build a page whose buttons wake a Grok Bot over a webhook | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |\n",
        replace: "",
      },
      {
        file: "skills/poteto-help/SKILL.md",
        find: "- `/loop` and `/create-skill` are Cursor built-ins.",
        replace: "- `/loop` is a Claude Code built-in. `skill-creator` comes from Anthropic's skills plugin.",
      },
      {
        file: "skills/poteto-help/SKILL.md",
        find: "can start Cursor's own skill for the same job instead",
        replace: "can start another installed skill for the same job instead",
      },
      {
        file: "skills/poteto-help/SKILL.md",
        find: "Cursor's Plan Mode works alongside it.",
        replace: "Claude Code's plan mode works alongside it.",
      },
      {
        file: "skills/poteto-help/SKILL.md",
        find: "so give the user the file's public copy: `https://github.com/cursor/plugins/blob/main/pstack/` followed by its path.",
        replace: "so give the user the file's public copy: `https://github.com/abdulbaruwa/plugins/blob/main/Claude/plugins/pstack/` followed by its path.",
      },
      {
        file: "skills/why/SKILL.md",
        find: "Before spawning investigators, list the available MCPs from the Cursor environment. Use the available-tools map when present. Otherwise inspect the `mcps/` directory Cursor exposes for enabled MCP servers.",
        replace: "Before spawning investigators, list the available MCP servers: the `mcp__<server>__*` tools in your tool list, including deferred tools that tool search can load.",
      },
      {
        file: "skills/reflect/SKILL.md",
        find: "Before fanning out, find this conversation's transcript in the `agent-transcripts/` directory the system prompt names. Do not glob across `~/.cursor/projects/*/`. That crosses workspace boundaries and reads private chats from unrelated projects.\n\n```bash\nls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10\n```\n\nThat covers the legacy flat (`<id>.jsonl`), current nested (`<id>/<id>.jsonl`), and subagent (`<parent>/subagents/<child>.jsonl`) layouts. For each candidate, read the first JSONL line. Take the file whose `message.content[0].text` contains the conversation's opening user prompt.",
        replace: `Before fanning out, find this conversation's transcript. \`<transcripts>\` is \`~/.claude/projects/<project-slug>\`, where the slug is ${SLUG}. Do not glob across \`~/.claude/projects/*/\`. That crosses workspace boundaries and reads private chats from unrelated projects.\n\n\`\`\`bash\nls -t <transcripts>/*.jsonl <transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10\n\`\`\`\n\nThat covers sessions (\`<session-id>.jsonl\`) and subagents (\`<session-id>/subagents/agent-<id>.jsonl\`). For each candidate, find the first line with \`"type": "user"\`; its \`message.content\` is a string or a list of blocks. Take the file whose first user message contains the conversation's opening user prompt.`,
      },
      {
        file: "skills/recall/SKILL.md",
        find: 'Transcripts live at `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`, where `<slug>` is the workspace path with the leading slash dropped and each "/" turned into "-" (so `/Users/you/proj` becomes `Users-you-proj`). Every line is one chat message.',
        replace: 'Transcripts live at `~/.claude/projects/<slug>/<session-id>.jsonl`, where `<slug>` is the absolute workspace path with every non-alphanumeric character turned into "-" (so `/Users/you/proj` becomes `-Users-you-proj`). Sessions run in a worktree live under that worktree\'s own slug (`<slug>--claude-worktrees-<name>`), and subagent transcripts under `<session-id>/subagents/`. Each line is one JSON event: chat turns have `"type": "user"` or `"assistant"`, and other events (summaries, file snapshots) can be skipped.',
      },
      {
        file: "skills/poteto-mode/playbooks/eval.md",
        find: "Read each candidate's local transcript under the active workspace's `agent-transcripts/` directory (the system prompt names this path). Do not glob across `~/.cursor/projects/*/`.",
        replace: `Read each candidate's transcript. Candidates are subagents, so match each one by the agent id its Agent call returned: \`~/.claude/projects/<project-slug>/<session-id>/subagents/agent-<agent-id>.jsonl\`, where the slug is ${SLUG}. Do not glob across \`~/.claude/projects/*/\`.`,
      },
      {
        file: "skills/maintain-verification-skill/SKILL.md",
        find: "(usually `.cursor/skills/verify-*/`)",
        replace: `(usually \`.claude/skills/verify-*/\`, or \`${KEEP}.cursor/skills/verify-*/\` in a repo set up for Cursor)`,
      },
      {
        file: "skills/automate-me/SKILL.md",
        find: "Look recursively for `.cursor/skills/**/*-mode/SKILL.md` and `~/.cursor/skills/*-mode/SKILL.md`",
        replace: `Look recursively for \`.claude/skills/**/*-mode/SKILL.md\` and \`~/.claude/skills/*-mode/SKILL.md\` (or \`${KEEP}.cursor/skills/**/*-mode/SKILL.md\` and \`${KEEP}~/.cursor/skills/*-mode/SKILL.md\`, for mode skills kept from Cursor)`,
      },
      {
        file: "agents/poteto-agent.md",
        find: "With no path, before any other work, search `~/.cursor/plugins/` for a file whose path ends in `skills/poteto-mode/SKILL.md`. If more than one file matches, use the copy whose `.cursor-plugin/plugin.json` has the highest `version`.",
        replace: "With no path, read `${CLAUDE_PLUGIN_ROOT}/skills/poteto-mode/SKILL.md`.",
      },
      {
        file: "agents/comment-sicko.md",
        find: "I run `/how`, `/why`, or both from the **how** and **why** skills on the named symbol or call.",
        replace: "I read and follow `${CLAUDE_PLUGIN_ROOT}/skills/how/SKILL.md`, `${CLAUDE_PLUGIN_ROOT}/skills/why/SKILL.md`, or both (the **how** and **why** skills) on the named symbol or call.",
      },
      {
        file: "docs/guide/01-setup.md",
        find: "In a Cursor chat, run:\n\n```text\n/add-plugin pstack\n```\n\nCursor confirms the plugin is installed.",
        replace: `In Claude Code, add this marketplace and install the plugin:\n\n\`\`\`text\n/plugin marketplace add <path-to-repo>/Claude\n/plugin install pstack@${MARKETPLACE.name}\n\`\`\`\n\nClaude Code confirms the plugin is installed. Skills run as \`/pstack:<skill>\`, for example \`/pstack:setup-pstack\`; the short \`/setup-pstack\` also works when no other command uses the name.`,
      },
      {
        file: "docs/guide/01-setup.md",
        find: "detects the models you have access to, asks for a reasoning budget,",
        replace: "asks for a reasoning budget,",
      },
      {
        file: "docs/guide/01-setup.md",
        find: "The defaults run at `xhigh` reasoning, the same as the `large` budget. `unlimited` lifts each model to its highest tier, up to `max`. Opus goes to `max`. Grok tops out at `xhigh`, so it stays there. `medium` and `small` lower the reasoning and spend fewer tokens.",
        replace: "The defaults (`sonnet` for code, `opus` for judgment and prose, `opus, sonnet` panels) match the `large` budget. `unlimited` moves the code roles to `opus` too. `medium` moves judgment to `sonnet`, `small` also moves code to `haiku`, and both run panels on `sonnet, haiku`, so they spend fewer tokens.",
      },
      {
        file: "docs/guide/01-setup.md",
        find: "A rerun of `/setup-pstack` keeps any role whose model differs from the default.",
        replace: "A rerun of `/setup-pstack` keeps any role whose model differs from what its old budget gave it.",
      },
      {
        file: "docs/guide/01-setup.md",
        find: "To keep `/poteto-mode` on for the whole chat, pick it from the `/` menu with Option+Enter (Mac) or Alt+Enter (Windows) instead of Enter. That makes it a [Custom Mode](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode), which stays in context on every turn until you exit it. Custom Modes are available in the Agents Window and the CLI. Plain Enter attaches the skill to one message, and it fades as the chat moves on.",
        replace: "Claude Code has no Custom Modes: `/pstack:poteto-mode` attaches to one message and fades as the session moves on, so start each new task with it.",
      },
      {
        file: "skills/poteto-mode/scripts/worktree-audit.sh",
        find: "# Transcripts dir: ~/.cursor/projects/<slugified-repo-path>/agent-transcripts.\nslug=$(printf '%s' \"$main_wt\" | sed 's#^/##; s#/#-#g')\ntranscripts=\"$HOME/.cursor/projects/$slug/agent-transcripts\"",
        replace: "# Transcripts dir: ~/.claude/projects/<repo path with every non-alphanumeric char as ->.\n# Sessions started inside a worktree live under that worktree's own slug.\nslugify() { printf '%s' \"$1\" | sed 's#[^A-Za-z0-9]#-#g'; }\ntranscripts=\"$HOME/.claude/projects/$(slugify \"$main_wt\")\"",
      },
      {
        file: "skills/poteto-mode/scripts/worktree-audit.sh",
        find: "\tif [ -d \"$transcripts\" ]; then\n\t\tf=$(rg -l -e \"${wt}/\" -e \"${wt}\\\"\" \"$transcripts\" 2>/dev/null \\",
        replace: "\tdirs=()\n\tfor d in \"$transcripts\" \"$HOME/.claude/projects/$(slugify \"$wt\")\"; do [ -d \"$d\" ] && dirs+=(\"$d\"); done\n\tif [ ${#dirs[@]} -gt 0 ]; then\n\t\tf=$(rg -l -e \"${wt}/\" -e \"${wt}\\\"\" \"${dirs[@]}\" 2>/dev/null \\",
      },
    ],
  },
  teaching: {
    notes: [],
    rewrites: [[/\bUse Ask user tool\./g, "Use the `AskUserQuestion` tool."]],
  },
  thermos: { skillIndex: true, notes: ["Agent references are namespaced (`thermos:thermo-nuclear-review-subagent`). The review agents read their rubric skills by path, since the Skill tool refuses user-only skills."] },
  coinbase: {
    patches: [
      {
        file: "README.md",
        find: "Cursor is not on that list yet, so the sign-in prompt cannot complete until Coinbase adds Cursor. Until then, use Coinbase's [CLI setup](https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/coinbase-mcp#cli) (`@coinbase/coinbase-cli` with a CDP API key) instead of this plugin.",
        replace: "Claude Code is on that list, so sign-in works from Claude Code.",
      },
    ],
  },
  greenhouse: {
    mcpOAuth: { callbackPort: OAUTH_CALLBACK_PORT },
    notes: [`Signs in on the fixed callback \`http://localhost:${OAUTH_CALLBACK_PORT}/callback\`, the URL the Greenhouse admin allowlists.`],
  },
  workable: {
    mcpOAuth: { callbackPort: OAUTH_CALLBACK_PORT },
    notes: [`Signs in on the fixed callback \`http://localhost:${OAUTH_CALLBACK_PORT}/callback\`, the URL Workable allowlists.`],
  },
};
