# pstack in Claude Code: native community port

This marketplace already adapts Cursor workflows to Claude Code. Use these rules for this port; do not apply the separate upstream generated-harness mappings a second time. Read this once when a skill points here.

## Tools, skills, and roles

Use only tools in the current session. `Task` means the native `Agent` tool, and `AskQuestion` means `AskUserQuestion` when available; otherwise ask in text. Use `TodoWrite` only when offered. pstack agents are namespaced, including `pstack:poteto-agent` and `pstack:comment-sicko`. A review brief is read-only even when its agent type has write tools. Use a type that retains required MCP tools for connected read-only research; never infer that a missing MCP tool exists.

Most pstack skills are explicitly user-invocable. When another skill routes to one, read its absolute `skills/<name>/SKILL.md` path from the plugin root given in the session-start context, then follow it. The Skill tool can reject user-only skills. Give subagents the needed absolute paths because they do not inherit the session-start note. User commands use `/pstack:<name>`.

Use the role aliases and budget from `~/.claude/rules/pstack-models.md` when present and the port's stated defaults otherwise. Accepted model aliases are `opus`, `sonnet`, `haiku`, and `fable`; `auto` and `inherit-parent` omit the model field. Pass effort separately only when the Agent tool exposes it. Never create an alias by appending an effort or fast suffix, and do not claim different model families when both reviewers use the same model.

## Ownership and lifecycle

Use worktree isolation for independent writes and bound concurrency to this machine's capacity. Worktrees share ports, so coordinate application instances. A named source branch is checked out explicitly by its owner; it is not inferred from an upstream default branch. One designated writer owns dependent-branch topology. Preserve the shipping playbook's independent verdicts, exact heads and patch identity, explicit merge authority, and current-trunk landing checks.

Continue an existing agent through `SendMessage` only when its retained state is needed; use completion notifications to wait. A query is not a reason to restart an idle worker. Fresh agents receive the original scope, later constraints, current evidence, and earlier reports. Local subagents end with the session; worktrees, pushed branches, and PRs can survive it. Do not claim persistent cloud workers or an installed background scheduler.

## Paths and conversation evidence

Project skills use `.claude/skills/`; user skills use `~/.claude/skills/`. Existing `.cursor/` instructions are evidence to inspect when relevant, not automatically active Claude configuration. This port's packaged rules are loaded through its session-start context; the model preference rule uses `~/.claude/rules/pstack-models.md`.

Read transcripts only for the authorized current conversation. Resolve the workspace's actual Claude project directory, including the worktree path when relevant, and match the first user message to this chat's opening request. The newest JSONL file is not sufficient identity. If the transcript cannot be identified, use the current conversation or an authorized handoff and report that limit. Never inspect another chat merely because it shares the project.

## Unavailable capabilities

Use ordinary forge commands for supported PR work within the user's authority. Cursor Custom Modes, cloud dashboards, Automations webhooks, and secret-request widgets do not transfer. Report an optional unsupported step as skipped with its reason. A missing dependency for verification, credentials, a review verdict, or landing remains blocked: do not substitute a placeholder and mark dependent work complete. `/loop` requires explicit requested scheduling and actual client support; this package installs no autonomous wake loop.
