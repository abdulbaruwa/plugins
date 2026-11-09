---
name: arena
description: "Compare independent candidate approaches against a concrete rubric, select a base, and verify a synthesis."
disable-model-invocation: true
---

# Arena

Read ../../docs/harness/claude-code.md for native tools, aliases, invocation policy, and ownership. Open a task list when the tool is available, covering Frame, Fan out, Cross-judge, Pick, Graft, and Verify.

## Phase A: Frame

1. State the artifact every candidate must produce and the user's constraints.
2. Define three to six observable scoring criteria. The rubric is for judging in Phase C/D; candidates receive the same task without the rubric.
3. Pick runners from the configured `arena runners` role, or the port's defaults of `opus` and `sonnet`. Use only supported native aliases; inherited entries omit the model field. Keep the configured number of seats. If an alias is rejected, use a supported configured alternative only within the user's authority, or drop that seat and disclose why; do not invent a model ID. If fewer than two candidates remain, add another run on a supported remaining alias, or use sequential independent attempts, and say so. Honor a user-configured single seat. Delegation and alternative model selection require authority and actual session support. A sequential comparison is not a parallel agent run.
4. Give each candidate its own output location, preferably an owned worktree. Each standalone brief includes the same task, source grounding, absolute required skill paths, allowed/prohibited paths and actions, expected artifact, and acceptance evidence.

## Phase B: Fan out

Use the native Agent tool when authorized, with the configured supported aliases and isolated outputs. Bound concurrency to the actual session and this machine. Otherwise generate candidates sequentially and disclose the limitation. Candidates see the task and grounding, not the scoring rubric, other candidates, or competing model identities. Ask each for its artifact and a short rationale naming alternatives considered and rejected. If a candidate produces no artifact, proceed with the remaining candidates and report the dropout.

## Phase C: Cross-judge

Wait until all candidates finish writing. Choose one judge from the ordered `arena cross-judge pool` only when an authorized, supported model from a different family than the parent's is actually available. Inherited and same-family entries never judge. Claude aliases select models within one family, so a second Claude alias does not satisfy this requirement. If no different-family model runs, skip this phase and disclose the limit; do not silently relax the requirement or invent model IDs. If the parent's family cannot be established, disclose that the family check did not run.

The judge is read-only. Its brief contains the rubric and completed artifacts identified only by neutral path labels, without candidate model names, identities, or other candidates' rationales. It scores each criterion and recommends a base with evidence. It runs alongside the parent's reading in Phase D, never while candidates are still writing.

## Phase D: Pick a base

Read every completed artifact end to end and score each criterion against actual evidence. Compare with the cross-judge only when one ran. Resolve a disagreement by reading both rationales and the artifacts again. Prefer a base a maintainer can extend safely, with a smaller coherent API when otherwise tied.

## Phase E: Graft

Review the losing candidates for a few useful elements and integrate them coherently into the selected base. Do not paste incompatible designs together. If the candidates converge, record that agreement; if they diverge because the task is ambiguous, reframe before combining them.

## Phase F: Verify

Verify the synthesized artifact against the task's acceptance checks. If proof exposes a missed candidate finding, revisit the graft; if it exposes a bad task contract, reframe. CI or a typecheck alone does not establish behavior. Respect existing approval and shipping gates.

## Outputs

Report the selected base, rubric scores, cross-judge result or explicit skip, grafts and rejected alternatives, convergence or dropped candidates, and concrete verification evidence. State when delegation, runtime proof, or different-family review was unavailable.
