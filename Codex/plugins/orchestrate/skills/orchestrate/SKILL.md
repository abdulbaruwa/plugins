---
name: orchestrate
description: "Coordinate a large Codex task across independent implementation and verification lanes with scoped handoffs and isolated writes."
---

# Codex orchestration

Read ../../references/codex-runtime.md. Define observable completion criteria and partition the task into independently verifiable units. Give each unit a scope, dependencies, output location, exact starting revision, validation commands, and ownership. Use Codex subagents when available and authorized; queue within the session's concurrency limit. Use separate worktrees or disjoint file paths for writers. Native subagents share the parent workspace unless explicitly isolated.

Collect handoffs containing changes, revision, checks, evidence, blockers, and remaining work. Inspect actual artifacts and rerun acceptance checks at the integrated revision. Give verification its own read-only pass. Resolve dependencies and conflicts before integration. Report incomplete or blocked units explicitly. Messaging other chats or external services retains its authorization requirement. This is native session orchestration, without the Cursor SDK dispatcher, cloud lifecycle, or Slack adapter.
