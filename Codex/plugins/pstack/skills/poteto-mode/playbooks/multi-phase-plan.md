# Multi phase plan

Read ../../../references/codex-runtime.md.

Produce a plan with dependencies, independently verifiable units, ownership, acceptance conditions, and proof scope. A planning-only request ends with the reviewable plan.

Finish with the actual result, checks run, gaps, and the next concrete step if work remains.

If phases form dependent branches, name the single topology writer and branch owners in the plan. Each dependent starts from its real parent. State which observations distinguish a worker waiting for input from a stalled run, and require current-head evidence before the next phase. A planning-only request creates no workers, publication, or implementation.
