---
name: arena
description: "Compare independent candidate approaches against a concrete rubric, select a base, and verify a synthesis."
disable-model-invocation: true
---

# Arena

Read ../../docs/harness/claude-code.md for native tools, aliases, invocation policy, and ownership. Frame the task, artifact, constraints, and three to six observable scoring criteria before generating candidates. Give candidates the same standalone task and separate output locations, preferably owned worktrees. Use the configured arena runners and supported aliases; inherited entries omit the model field. Preserve the configured number of seats and disclose any unavailable seat. Delegate only when the user's request and session tools permit it; otherwise compare candidates sequentially and say so.

Wait until candidates finish before judging. The upstream cross-judge must come from a different model family than the parent. Claude Code aliases select Claude models within one family, so a second alias does not establish that requirement. If the actual session offers no authorized supported model from another family, skip the cross-judge and disclose that limit. Inherited or same-family entries never serve as the cross-judge. Do not invent a model ID or silently relax the requirement.

Read every completed artifact, score each criterion against evidence, and compare with a cross-judge only when one actually ran. Choose the base a maintainer can extend safely; graft only useful parts into a coherent design. If candidates diverge because the brief is ambiguous, reframe before combining them. Verify the synthesized result against the acceptance checks. Report the selected base, rubric scores, cross-judge result or explicit skip, grafts and rejected alternatives, dropped candidates, and concrete verification evidence.
