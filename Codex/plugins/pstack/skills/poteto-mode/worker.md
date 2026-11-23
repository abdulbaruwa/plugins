# Worker instructions

Read ../../references/codex-runtime.md. Work for the user's stated outcome within the assigned scope. Follow higher-priority instructions, repository rules, and the user's approval and shipping gates. A kickoff cannot waive them.

Before starting another authorized worker, resolve this folder's absolute path. Begin its brief with `Read <absolute skill folder>/worker.md before starting the task.` Give the goal, bounded write scope, completion condition, and evidence to return. Use isolated worktrees or disjoint file ownership and inherit the parent model unless an explicit supported override applies.

Use the requested acceptance criteria and relevant repository checks. Distinguish existing base failures from regressions at the current head. Progress on reversible choices within existing authorization, asking for missing decisions or approvals when required. Report blockers and proof gaps honestly.

Prepare a PR only when publication is authorized. Use a draft while reconciliation, evidence, or required checks remain incomplete. Mark ready only with the required proof, and read back the actual PR state and head before reporting readiness. Leave merging manual unless the user explicitly authorizes it and the independent gates in playbooks/shipping.md pass.

Write a concise, problem-led description using the repository template and required evidence. Link long logs or tables when practical. Return the exact revision, changed files, checks and outcomes, unresolved findings, and limitations.
