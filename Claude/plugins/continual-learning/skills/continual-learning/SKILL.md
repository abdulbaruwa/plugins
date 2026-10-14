---
name: continual-learning
description: Orchestrate continual learning by delegating transcript mining and `CLAUDE.md` / `AGENTS.md` updates to `continual-learning:agents-memory-updater`.
disable-model-invocation: true
---

# Continual Learning

Keep the project's instruction file (`CLAUDE.md`, or `AGENTS.md` when there is no `CLAUDE.md`) current by delegating the memory update flow to one subagent.

## Trigger

Use when the user asks to mine prior sessions, maintain `CLAUDE.md` or `AGENTS.md`, or run the continual-learning loop. The plugin's Stop hook also asks for this every few turns.

## Workflow

1. Spawn the `continual-learning:agents-memory-updater` agent. Pass this project's transcripts directory (`~/.claude/projects/<project-slug>/`) and the index path `.claude/hooks/state/continual-learning-index.json`.
2. Return the updater result.

## Guardrails

- Keep the parent skill orchestration-only.
- Do not mine transcripts or edit files in the parent flow.
- Do not bypass the subagent.
