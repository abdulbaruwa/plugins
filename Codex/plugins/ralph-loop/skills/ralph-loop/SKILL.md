---
name: ralph-loop
description: "Run a bounded iterative development loop when the user explicitly asks for Ralph-style iteration until a verified completion condition."
---

# Ralph loop

Establish the task, a measurable completion condition, and an iteration limit. Default to 10 iterations when none is supplied. State that limit before starting. Each iteration inspects current files, runs the relevant check, fixes the next concrete failure, and evaluates the completion condition again. Stop on completion, cancellation, exhausted limit, a required decision, or a repeated external blocker. Never call an unverified completion promise true.

For a resumable loop, keep task-owned state at .codex/ralph/state.json with the task, limit, iteration, status, last evidence, and remaining failure. Preserve unrelated state and leave the file uncommitted. Update it after each iteration. Report the last completed iteration and evidence. This loop runs in the current Codex turn. Continuing across turns requires an explicitly requested native goal or automation; this plugin installs no stop hook.
