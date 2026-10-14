---
name: advisor
description: >-
  Advisor mode. Consult a stronger (or different) model at key checkpoints:
  before major decisions, when stuck on an error, and before declaring a task
  done. Use when the user types /advisor:advisor, asks to turn this plugin's
  advisor mode on or off, picks a model for it, or explicitly asks for a
  second opinion from a stronger or different model. Claude Code's built-in
  /advisor command is separate and needs no skill. Never enable it on your own.
argument-hint: "[model | off | status | ask <question> | nudge on|off]"
---

# Advisor

You are the main model. Advisor mode adds a second model that you consult at a few key points. The advisor gets your briefing (and the full transcript when available), thinks hard, and returns a verdict with guidance. It does not edit files. You still do the work and make the final call.

State lives in `.claude/advisor/state.json` at the project root. When that file exists with `"enabled": true`, advisor mode is on for this project.

Claude Code also has a built-in advisor tool, set with the `/advisor` command. It covers the same checkpoints server-side. If it is on in this session, say so once when enabling this mode, and do not consult both at the same checkpoint.

## Commands

The text after `/advisor:advisor` selects the action.

| Input | Action |
| --- | --- |
| *(none)* | Enable for this session with the default advisor, `opus`. If a state file already exists, from this or another session, re-bind it here, keeping its `model` and `nudge` settings. |
| `<model>` | Same, with the given model: `opus`, `fable`, `sonnet`, or `haiku`. |
| `off` | Disable: delete `.claude/advisor/`. |
| `status` | Report model, consult count, and whether the end-of-turn nudge is on. Changes nothing. |
| `ask <question>` | Consult now about the current work, regardless of checkpoint. |
| `nudge on` / `nudge off` | Toggle the end-of-turn reminder posted by the plugin's Stop hook (default on). |

If the message also contains a task (`/advisor:advisor, then refactor the cache layer`), enable first, then do the task under advisor mode.

### Choosing the model

The `advisor:advisor-subagent` agent runs on `opus` at `xhigh` effort by default. The Agent tool's `model` parameter takes an alias: `opus`, `fable`, `sonnet`, or `haiku`. Map the user's request to one of those (for example "the big one" → `opus`). If nothing matches, say so, list the aliases, and keep the current model. A second opinion is most useful from a model other than the one you are running on, so when the user asks for "a different model", pick an alias that differs from yours.

## Enabling

1. Resolve the model as described above.
2. Write `.claude/advisor/state.json` with the Write tool (not a shell redirect), creating the directory if needed. If a state file already exists, carry over its `model` (unless this command names one) and `nudge`, and reset every other field to the values below. You cannot see which session an existing file belongs to, so always rewrite it: that re-binds the mode to this session, the hooks re-fill `session_id` and `transcript_path`, and the next consult starts a fresh advisor instead of continuing another session's. Also delete `.claude/advisor/pending` if it exists, so a marker left by another session cannot trigger the end-of-turn nudge here. Keep `log.md`.

   ```json
   {
     "enabled": true,
     "model": "opus",
     "nudge": true,
     "advisor_agent_id": null,
     "session_id": null,
     "transcript_path": null,
     "consults": 0,
     "last_consult_at": null,
     "enabled_at": "<current UTC time, ISO 8601>"
   }
   ```

   The plugin's hooks fill in `session_id`, `transcript_path`, `consults`, and `last_consult_at`. Leave them alone.
3. Confirm in one line: `Advisor on: <model>. I'll consult it before major decisions, when I'm stuck, and before I call the task done.` Then continue with any task in the same message.

Never stage or commit `.claude/advisor/`.

## Checkpoints

Consult at these points and nowhere else. Each consult is a strong-model call; the value comes from using it selectively.

1. **Before a major decision.** Choosing between architectures or approaches; changes that are hard to reverse or have a wide blast radius (schema or data migrations, deleting or rewriting a module, public API or config format changes, dependency swaps, auth, payments, or other security-sensitive code); or a request that is ambiguous in a way that would change the work materially. Consult once you have a concrete plan and the options in hand, not before you understand the problem. One consult covers the plan; do not re-consult per file.
2. **When stuck.** The same error or failing test after two genuine fix attempts; behavior you cannot explain from the code; or when you are about to reach for a workaround: a retry loop, a `sleep`, a broad `try/except`, skipping a test, or disabling a check to get past something.
3. **Before declaring done.** Any task that changed logic or touched more than a couple of files: consult once before writing the final summary, and include what you verified and how. Skip for trivial edits (typos, comments, a one-line config change) and say so in one line.
4. **On request.** `/advisor:advisor ask ...`, or the user asks what the advisor thinks.

Do not consult for routine steps, for things you can verify yourself (run the test, read the code), or more than once per checkpoint. If you would consult more than about four times in one task, the task should probably be split, or you should ask the user.

## How to consult

1. Read `.claude/advisor/state.json` and decide which situation you are in:
   - **Mode on here**: the file exists with `enabled: true` and you ran the Enabling steps in this session. Checkpoint consults and `ask` both follow the steps below in full, including continuing the saved advisor and state writes.
   - **Not on here**: the file is missing, `enabled` is false, or you did not write it. A file you did not write belongs to another session; only `/advisor:advisor` re-binds it, so leave it alone and never continue an `advisor_agent_id` you did not save yourself. Do not consult at checkpoints. If the user explicitly asks for a consult in this message (`ask ...`, or a request for a second opinion), run it as a one-off: a fresh spawn on the file's `model` if there is one, otherwise `opus`; no continuing, no state writes, and no `transcript_path` (another session's transcript is not yours to share; write "not available"). Mention that `/advisor:advisor` turns the mode on for this session.
2. Build the briefing from `references/briefing-template.md`. Give the advisor everything it needs to disagree with you:
   - The user's request verbatim, plus constraints or corrections they added later.
   - What has happened so far, in order: what you investigated, decided, changed, tried, and ruled out.
   - Relevant tool results verbatim: error messages, stack traces, test output, diffs. Trim unrelated noise and mark trims with `[...]`, but never paraphrase evidence.
   - Current state: `git status --short`, `git diff --stat`, files you touched, anything half-done.
   - Your specific questions, the options you see, and your current leaning with reasons.
   - The `transcript_path` from `state.json` when set and the mode is on in this session, so the advisor can read the full conversation itself.
   - No secrets. Redact tokens, keys, and `.env` values.
3. Consult in the foreground and wait for the answer:
   - When `state.advisor_agent_id` is set, continue that advisor with `SendMessage` to the saved id. It keeps the context of earlier consults, so the briefing can be a delta: what changed since last time plus the new questions. If `SendMessage` is unavailable or fails, spawn fresh.
   - Otherwise spawn it with the Agent tool: `subagent_type: "advisor:advisor-subagent"`, `model: <state.model>`, `description: "Advisor: <checkpoint>"` (for example `Advisor: pre-completion review`), `run_in_background: false`.
   - Save the agent id from the result to `advisor_agent_id` in `state.json`. Clear it when the model changes.
4. Act on the verdict:
   - `proceed`: go.
   - `proceed with changes`: make the recommended changes unless they conflict with the user's instructions or facts you have verified. Say which you skipped and why.
   - `stop`: do not continue with the plan. Rethink, or bring the disagreement to the user if it is a product or scope question.
   - If the advisor asks for something it needs, provide it with one `SendMessage`. Do not ping-pong.
   - You are accountable for the result. The advisor is a strong second opinion, not an authority. If it is wrong about the codebase, show it the evidence once, or overrule it and tell the user why.
5. Report each consult to the user in one or two lines: `Advisor (<model>): <verdict>. <One-line summary>. <What you did about it.>` Keep the advisor's full response out of the chat unless the user asks; the hooks also append it to `.claude/advisor/log.md`.

## End-of-turn nudge

When files changed since the last consult and a turn ends without one, the plugin's Stop hook keeps the turn going with a message that starts with `[Advisor]`. Treat it as the "before declaring done" checkpoint: run the pre-completion consult, or answer in one line that the change was trivial, or that you are waiting on the user, and stop. It fires at most once per batch of edits and never twice in a row. `/advisor:advisor nudge off` disables it.

## Disabling

`/advisor:advisor off`: delete `.claude/advisor/` and confirm in one line. Do not consult again in this session unless the user re-enables the mode or explicitly asks for a one-off consult.

## Guardrails

- Never enable advisor mode unasked. "Get a second opinion on this" is a one-off consult, not a mode change.
- The advisor is read-only. Never ask it to edit files or do the task.
- Never loop on the advisor: at most one follow-up per checkpoint.
- If the `advisor:advisor-subagent` agent is unavailable (no Agent tool, or a hook denies it), tell the user once and continue without it.
