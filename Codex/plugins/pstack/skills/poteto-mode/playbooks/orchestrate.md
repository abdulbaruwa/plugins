# Orchestrate

Read ../../../references/codex-runtime.md.

Use this for a standing program with multiple independently owned units. One task driven to a completion condition belongs in autonomous-run.md. The coordinator assigns work and verifies results; branch owners implement fixes. Use the current session's authorized native delegation tools. Do not require the separate orchestrate plugin, the removed orch CLI, Cursor Task/cloud arguments, or a proprietary Project store.

Keep a durable tracker at an agreed project-owned path with the goal, units, dependencies, owners, branch/PR links, exact heads, evidence, verdicts, and next actions. Update it after meaningful changes. A tracker cannot create background execution; continuation beyond the current turn still requires a user-requested native goal or automation.

Each worker brief is standalone: intent, allowed paths, prohibited actions, dependencies and their actual evidence, acceptance commands and expected results. Isolate writes and queue within the session's available slots. Start with one representative unit before expanding. Add a sub-coordinator only for a distinct area that needs several workers. Reuse a worker for follow-up on the same unit; create a fresh worker for independent work. Use native wait/status tools to observe progress, and messages only for substantive instructions. Prefer PR/CI subscriptions when available; otherwise use bounded checks. Keep unchanged monitoring quiet.

Read actual diffs and artifacts before accepting a worker's summary. Each behavioral unit needs evidence beyond typechecking. Use an independent verifier when available and authorized, bound to the current head. Different-model-family verification requires explicit supported model choices; otherwise disclose its absence. CI alone is not a verdict, and a changed head requires current evidence under shipping.md.

Return scope drift to its owner. Distinguish waiting for input from a stalled run. Retry by cause with a smaller scope or a replacement worker; after two unsuccessful retries, replan the unit. Reconcile late results against the current PR state. Account for every worker as completed, replaced, or absorbed into another unit. Resolve routine mechanics within authority; bring the user only decisions or blockers that need their input.

For a dependent chain, apply the runtime topology-ownership rules: one designated writer changes bases and targets, workers author only their own fixes, and each dependent starts from its actual parent. Distinguish waiting for required input from a stalled worker, refresh proof after changed heads, and keep unchanged monitoring quiet. Actual landing follows shipping.md and the user's authorization.

Finish with progress against the goal, each PR's live state, head and verdict, evidence links, dropped units and reasons, and the decisions waiting on the user. If native delegation is unavailable or unauthorized, report that limit and use a scoped sequential workflow; do not claim a coordinator program ran.
