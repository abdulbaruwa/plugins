# Autopilot stack

Read ../../../references/codex-runtime.md.

Inspect the real dependency order and base/head revisions for each change. Integrate and validate in order, preserving unrelated checkout work. Review and publish only within explicit scope; upstream readiness does not prove downstream acceptance.

Use this playbook when the user will land the PRs. Build the agreed stack, then hand it off with each PR's current head, verdict, blockers, and evidence. Do not merge, append new scope, or keep driving after that handoff unless requested. Use autopilot-full.md only when the run has explicit merge authority. An owner rebases a stacked branch onto its actual parent branch; only the bottom branch rebases onto trunk, and every topology change follows the designated writer's instructions.

Finish with the actual result, checks run, gaps, and the next concrete step if work remains.

Designate the topology writer before workers start. Branch owners fix only their own branches; topology changes belong to the designated writer under the runtime ownership and pinned-lease rules. Base dependents on the actual parent tip and freeze the chain during landing. Re-read exact current heads, checks, and forge merge results before advancing. Use shipping.md for the independent-verification ceiling, trunk preparation, and serial landing gates.
