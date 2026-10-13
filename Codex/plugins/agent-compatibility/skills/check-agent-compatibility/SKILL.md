---
name: check-agent-compatibility
description: "Assess whether an agent can start a repo, run focused validation, and trust its documentation, using the compatibility scanner and observed workflows."
---

# Agent compatibility

Read ../../references/codex-runtime.md. Run four distinct passes using ../../references/agents/compatibility-scan-review.md, startup-review.md, validation-review.md, and docs-reliability-review.md. Scope all passes to the requested checkout. Delegate when available and authorized; otherwise run the same passes sequentially. Record actual commands and outcomes. Avoid destructive setup or services outside the authorized scope.

If the deterministic scanner succeeds, combine its score at 70% with the rounded average of the three observed workflow scores at 30%. Support scores with findings, not coarse guesses. If the scanner is unavailable, report the missing scanner and qualitative workflow findings without fabricating the combined score. Return one Agent Compatibility Score when valid, plus prioritized fixes. Show the breakdown only when asked.
