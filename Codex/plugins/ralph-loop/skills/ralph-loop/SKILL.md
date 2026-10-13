---
name: ralph-loop
description: "Run a bounded iterative development loop when the user explicitly asks for Ralph-style iteration until a verified completion condition."
---

# Ralph loop

Establish the task, a measurable completion condition, and an iteration limit. Default to 10 iterations when none is supplied. State that limit before starting. Each iteration inspects current files, runs the relevant check, fixes the next concrete failure, and evaluates the completion condition again. Stop on completion, cancellation, exhausted limit, a required decision, or a repeated external blocker. Never call an unverified completion promise true.

For a resumable loop, use the bundled [state.py](state.py). Establish an owner ID from this chat's host-provided identity. If none is exposed, generate a UUID once and retain it in this conversation's state capsule. Retain the run ID returned by start as well. An owner ID from a stored file, the newest run, the task text, or a repository path cannot establish ownership.

Call the helper using its absolute installed path and the explicit workspace:

```sh
python3 "<skill-directory>/state.py" --workspace "<checkout>" start --owner "<owner_id>" --task "<task>" --limit 10
```

It allocates `.codex/ralph/runs/<run_id>/state.json`. Use `show`, `update`, or `resume` with the same owner and run IDs. Record each iteration through `update --iteration N --status active|completed|blocked --evidence "<fresh proof>" --failure "<remaining failure>"`. A blocked run can resume when iterations remain. Cancelled, completed, or exhausted runs retain their final evidence; starting again creates a new run.

The helper verifies ownership before returning or changing progress, serializes writes to each run, and replaces state atomically. Never alter another run or automatically adopt the legacy `.codex/ralph/state.json`. If this conversation lost its owner/run capsule, report that gap instead of selecting another chat's state. Leave all local state uncommitted and preserve other chats' files.

Report the last completed iteration, run ID, and evidence. This loop runs in the current Codex turn. Continuing across turns requires an explicitly requested native goal or automation; this plugin installs no stop hook.
