---
name: dyl-ready-pr
description: "Prepare an existing PR for review readiness by fixing accepted findings, validating the current revision, and checking CI within the user-authorized scope."
---

# Dyl ready PR

Read ../../references/codex-runtime.md and ../dyl-review/SKILL.md. Resolve the existing PR, actual base, head SHA, draft state, and mergeability. Run deep review unless a recent verified pass still applies to the current head. Fix accepted findings in scope and rerun the affected checks. Keep changes on the same PR. Cap review/fix rounds at four; unresolved findings remain blockers.

When publication is authorized, commit selective changes, push, and mark a clean reviewed draft ready. Resolve conflicts only when both sides' intent is understood, then rerun relevant checks. Check all PR-attached CI at the new head SHA. Use bounded waits and report absent or stalled required checks explicitly. Stop at merge-ready or a concrete blocker. Merging or enabling auto-merge requires the user's actual authorization; readiness alone grants neither.

Report the PR URL, reviewed SHA, accepted and rejected findings, tests, draft state, conflicts, and CI/readiness. Never call a capped or partially tested run merge-ready.
