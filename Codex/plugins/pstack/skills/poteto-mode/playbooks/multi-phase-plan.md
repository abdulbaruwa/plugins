# Multi phase plan

Read ../../../references/codex-runtime.md.

Produce a plan with dependencies, independently verifiable units, ownership, acceptance conditions, and proof scope. A planning-only request ends with the reviewable plan.

Name autopilot-full.md when execution is authorized to merge, autopilot-stack.md when the user lands the PRs, or orchestrate.md for a standing program. Distinguish existing trunk failures from regressions the proposed changes introduce or newly expose. Each unit needs a concrete acceptance surface and evidence at its reviewed head.

Finish with the actual result, checks run, gaps, and the next concrete step if work remains.

If phases form dependent branches, name the single topology writer and branch owners in the plan. Each dependent starts from its real parent. State which observations distinguish a worker waiting for input from a stalled run, and require current-head evidence before the next phase. A planning-only request creates no workers, publication, or implementation.
