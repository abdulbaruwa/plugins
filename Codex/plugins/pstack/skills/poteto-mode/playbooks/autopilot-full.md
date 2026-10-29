# Autopilot full

Read ../../../references/codex-runtime.md.

Establish the explicit unattended scope, completion criteria, and user gates. Work through independent units with real acceptance checks and a useful decision trail. Preserve authorization boundaries and stop on required input. A native goal or automation needs an explicit user request.

Choose this playbook only when the run may merge; use autopilot-stack.md for a user-landed stack. Rebase onto the real parent or trunk before the code-ready report. Keep that base through fix rounds unless merge preparation, a conflict, a trunk-caused failure, or a known concurrent change to the same files requires a new base. Record existing trunk failures separately; they do not excuse a regression the PR introduces or newly reaches.

Finish with the actual result, checks run, gaps, and the next concrete step if work remains.

One branch owner writes fixes; apply the topology and ownership rules in the runtime guidance. Before unattended work, obtain a full independent review with the actual acceptance surface. After a minor, conflict-only, or rebase change, use a fresh independent verifier for the affected behavior; repeat the full review for major behavior, design, or diff changes. Refresh checks at the exact current head after every change. A trunk regression gates this PR when it copies or newly reaches the broken behavior. Never accept disabled or soft-failed checks as proof, and require fresh independent evidence before relaxing an acceptance gate. For shipping, retain the stronger patch-identity and verifier gates in shipping.md. Classify a worker waiting on input as waiting, rather than stuck. Keep unchanged monitoring ticks quiet.
