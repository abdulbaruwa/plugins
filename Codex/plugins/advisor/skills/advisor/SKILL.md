---
name: advisor
description: "Give a read-only second opinion on a concrete decision, recurring failure, or pre-completion claim when the user asks for an advisor."
---

# Advisor

Read ../../references/codex-runtime.md. Consult only when the user requests a second opinion or enables advisor checkpoints for the current chat. Gather the request, constraints, options, current diff, relevant errors, and validation evidence using references/briefing-template.md. Supply ../../references/agents/advisor-subagent.md as the review procedure to an ordinary subagent when available and authorized. Inherit the parent model unless the user explicitly selects a supported alternative. Use a fresh reviewer for a new chat; share only this chat's evidence.

Keep the reviewer read-only. Return a concrete verdict and validate proposed findings yourself before acting. At most one evidence follow-up per checkpoint. Checkpoints are major decisions, the same failure after two meaningful attempts, and nontrivial completion claims. Enablement is conversation-scoped; $advisor off ends it. Without delegation, perform an explicitly labeled self-review. No persistent state, automatic nudge, transcript sharing, or stop hook is installed.
