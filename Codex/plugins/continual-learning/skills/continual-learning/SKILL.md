---
name: continual-learning
description: "Update repository AGENTS.md from high-signal user preferences and workspace facts when the user explicitly requests learning from relevant chats."
---

# Continual learning

Read ../../references/codex-runtime.md. Run the procedure in ../../references/agents/agents-memory-updater.md in a scoped read-only extraction pass, then apply only the authorized update to repository AGENTS.md. Use available chat tools or a user-specified transcript corpus; keep the corpus scoped to the relevant workspace. Preserve all existing AGENTS.md sections and instructions. Update matching learned bullets in place, deduplicate, keep at most 12 bullets per learned section, and exclude secrets and transient task instructions. If no durable fact is supported, leave the file unchanged and report that. This is an on-demand workflow; no transcript hook runs on installation.
