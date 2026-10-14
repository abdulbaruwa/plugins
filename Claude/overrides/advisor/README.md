# Advisor

Advisor gives Claude a second model to consult at key points: before a major decision, when it is stuck on an error, and before it declares a task done. The main model keeps doing the work; the advisor reads a full briefing (and the session transcript when available), thinks hard, and returns a verdict with concrete guidance.

## Built-in advisor or this plugin?

Claude Code ships a built-in [advisor tool](https://code.claude.com/docs/en/advisor) (`/advisor opus`). It runs server-side, sees the full conversation, and Claude decides when to call it. Prefer it when you can use it. This plugin is the Cursor workflow ported to Claude Code. It is useful when:

- the built-in advisor is unavailable: it needs the Anthropic API, so it does not run on Amazon Bedrock, Google Cloud, or Microsoft Foundry
- you want explicit checkpoints, a Stop-hook reminder before Claude calls the work done, and a consult log in `.claude/advisor/log.md`

Because `/advisor` is the built-in command, this plugin's command is `/advisor:advisor`.

## Installation

```text
/plugin marketplace add <path-to-repo>/Claude
/plugin install advisor@cursor-plugins-claude
```

## Quick start

```text
/advisor:advisor                     turn on with the default advisor (opus)
/advisor:advisor fable               turn on with a different model: opus, fable, sonnet, or haiku
/advisor:advisor ask is this migration safe to run twice?
/advisor:advisor status
/advisor:advisor off
```

Then work as usual. When Claude hits a checkpoint it consults the advisor and reports back in a line or two:

```text
Advisor (opus): proceed with changes. The retry wrapper hides the real failure; the 401
comes from a stale token cache. Dropped the retry, fixed the cache key.
```

A second opinion is most useful from a model other than the one you are running. In an Opus session, `/advisor:advisor fable` (if you have Fable access) gives a stronger advisor than the default.

## How it works

- **Skill `advisor`** implements the command and the checkpoint protocol: when to consult, how to write the briefing, how to act on the verdict, and how to report it. See [skills/advisor/SKILL.md](skills/advisor/SKILL.md) and the [briefing template](skills/advisor/references/briefing-template.md).
- **Agent `advisor:advisor-subagent`** runs on `opus` at `xhigh` effort by default (the `model` chosen with the command overrides it per session). Its file-writing tools are disabled; it can still run shell commands to inspect the repository. It verifies the briefing against the repository, reads the transcript when a path is available, and answers with `Verdict / Why / Recommendations / Risks / Answers / Confidence`. Follow-up consults continue the same advisor with `SendMessage` when the session has it, and spawn a fresh one otherwise.
- **Hooks** keep the mode honest without adding chatter. They need `jq` on `PATH` and do nothing without it.
  - `PostToolUse` on `Edit|Write|MultiEdit|NotebookEdit` records that files changed since the last consult.
  - `SubagentStop` on `advisor:advisor-subagent` counts each consult and appends the advice to `.claude/advisor/log.md`.
  - `Stop` keeps the turn going with a one-line `[Advisor]` message when it ends with unreviewed edits, so the pre-completion consult is not skipped. It fires at most once per batch of edits, never twice in a row, stays quiet when Claude ended its turn with a question for you, and can be disabled with `/advisor:advisor nudge off`.

## Checkpoints

| Checkpoint | Trigger |
| --- | --- |
| Major decision | Choosing between approaches; migrations, deletions, public API or config changes, dependency swaps, auth or payment code; requests ambiguous enough to change the work. |
| Stuck | Same error or failing test after two real attempts; unexplained behavior; about to add a workaround (retry loop, `sleep`, broad `try/except`, skipped test, disabled check). |
| Before declaring done | Any task that changed logic or touched more than a couple of files. Trivial edits are skipped and said so. |
| On request | `/advisor:advisor ask ...`, or asking what the advisor thinks. |

The skill caps this at roughly four consults per task and never consults for routine steps or things Claude can verify itself.

## State

Everything lives in `.claude/advisor/` at the project root and is safe to delete at any time:

| File | Purpose |
| --- | --- |
| `state.json` | Mode, model, nudge setting, consult count, bound session, transcript path, saved advisor agent id. |
| `log.md` | Every completed consult with its verdict, for later review. |
| `pending` | Marker: files changed since the last consult. |

Add `.claude/advisor/` to your `.gitignore` if you do not want it in the repository; the skill never stages it.

## Limitations

- State is per project, bound to the session that enabled it. `/clear` starts a new session, so run `/advisor:advisor` again afterwards. Running it in a second session on the same project re-binds the mode there (model and nudge settings carry over; the consult history and advisor context start fresh). Use `/advisor:advisor status` to look without re-binding.
- Edits made through shell commands (`sed -i`, redirects) are not tracked, only the file-editing tools.
- The end-of-turn nudge relies on the plugin's hooks; where hooks do not run, the skill still performs the pre-completion consult on its own.

## License

MIT
