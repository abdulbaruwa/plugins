---
name: thermos
description: "Combine correctness/security and code-quality reviews of a specified branch or diff using two independent passes."
---

# Thermos

Read ../../references/codex-runtime.md. Fix the scope and base revision from the user's request and inspect the complete diff. Run separate review passes with ../../references/agents/thermo-nuclear-review-subagent.md and ../../references/agents/thermo-nuclear-code-quality-review-subagent.md. Delegate independently when available and authorized, or run sequentially and disclose that.

Give both passes the same revision and relevant context. Verify findings against code, deduplicate overlaps, resolve disagreements using evidence, and return prioritized findings with file references. Keep reviews read-only unless the user requests remediation. Report proof gaps and checks that were actually run. Shipping and merge require the user's existing authorization.
