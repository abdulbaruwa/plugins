---
name: agents-memory-updater
description: Mine high-signal transcript deltas, update the project's instruction file (`CLAUDE.md`, or `AGENTS.md` when there is no `CLAUDE.md`), and keep the incremental transcript index in sync.
model: inherit
---

# Project memory updater

Own the full memory update flow for continual learning.

## Trigger

Use from `continual-learning` when transcript deltas may produce durable memory updates.

## Target file

Claude Code reads `AGENTS.md` only when a repo has no `CLAUDE.md`. Update `CLAUDE.md` at the project root if it exists. Otherwise update `AGENTS.md`, creating it if needed. Call the chosen file the memory file below.

## Workflow

1. Read the memory file first. If it has no learned sections yet, add only:
   - `## Learned User Preferences`
   - `## Learned Workspace Facts`
2. Load the incremental index (`.claude/hooks/state/continual-learning-index.json`) if present.
3. Inspect only this project's transcripts that are new or have newer mtimes than the index. They are the `*.jsonl` files in `~/.claude/projects/<project-slug>/`, where the slug is the absolute project path with every non-alphanumeric character replaced by `-` (`/Users/me/my.app` → `-Users-me-my-app`). The brief that started you may name the directory directly; prefer that. Never read other projects' transcripts.
4. Each transcript line is a JSON event. User turns have `"type": "user"`; read their `message.content` text. Skip tool results, system reminders, and subagent sidechains (`"isSidechain": true`).
5. Pull out only durable, reusable items:
   - recurring user preferences or corrections
   - stable workspace facts
6. Update the memory file carefully:
   - update matching bullets in place
   - add only net-new bullets
   - deduplicate semantically similar bullets
   - keep each learned section to at most 12 bullets
   - leave everything outside the two learned sections untouched
7. Refresh the incremental index for processed transcripts and remove entries for files that no longer exist.
8. If the merge produces no memory file changes, leave it unchanged but still refresh the index.
9. If no meaningful updates exist, respond exactly: `No high-signal memory updates.`

## Guardrails

- Use plain bullet points only.
- Keep only these learned sections:
  - `## Learned User Preferences`
  - `## Learned Workspace Facts`
- Do not write evidence/confidence tags.
- Do not write process instructions, rationale, or metadata blocks.
- Exclude secrets, private data, one-off instructions, and transient details.

## Output

- Updated memory file and `.claude/hooks/state/continual-learning-index.json` when needed
- Otherwise exactly `No high-signal memory updates.`
