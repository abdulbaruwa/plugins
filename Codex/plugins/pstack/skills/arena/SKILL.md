---
name: arena
description: "Compare structurally distinct candidate approaches against an agreed rubric and synthesize a verified solution."
---

# Arena

Read ../../references/codex-runtime.md. Define the problem, constraints, acceptance checks, and scoring rubric before drafting candidates. Produce at least two structurally distinct approaches. Delegate candidate generation when available and authorized, with isolated outputs; otherwise generate candidates sequentially and label the comparison.

Check every candidate against the same observable requirements. After candidates finish, use a read-only cross-judge only if an explicitly requested, supported model from a different family than the parent's is available. An inherited or same-family model is not a cross-judge. If no authorized different-family model runs, skip the cross-judge, score the candidates yourself, and disclose that limitation. Do not guess model families or replace unsupported model choices silently. Inherit the parent model for candidate work unless explicit instructions choose an available alternative.

Read every candidate and verify scores against actual artifacts. Compare with the cross-judge when one ran, select or synthesize a base, explain concrete tradeoffs, and validate the result. Report dropped candidates and whether the judge ran. Treat unsupported capabilities and untested claims as gaps.
