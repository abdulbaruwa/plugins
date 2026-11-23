### Opening a PR

Use an owned worktree, the correct intended base and the explicitly authorized repository. Preserve unrelated changes and concurrent work. Run the applicable cleanup and checks on the committed head. Rewriting a published branch requires separate authority and the designated topology owner; this playbook grants none.

Follow the repository's PR template. Lead with the user outcome, then explain the concrete change, scope, tradeoffs, blast radius and verification. Keep the briefing concise and retain the evidence and remaining proof gaps needed for review; an arbitrary line limit must not hide them.

Open a draft while reconciliation or required evidence is incomplete. Use the PR tool's actual draft setting or `gh pr create --draft` for that state. Mark ready only when the required work and evidence are complete at the current head. A ready PR and green CI do not authorize merging, approval, auto-merge, a main push or deployment.

Stack a follow-up only when it depends on the lower branch, recording the intended landing base and owner. Read back the PR's repository, base, head and draft state. Opening a PR starts no babysitting or background automation. Leave merging manual unless the operator separately authorizes it.
