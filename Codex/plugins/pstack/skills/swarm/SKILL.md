---
name: swarm
description: "Run scoped independent Codex workers and consolidate their evidence when the user requests parallel coverage or competing approaches."
---

# Swarm

Read ../../references/codex-runtime.md. Define the completion condition, partition or race shape, required slices, and selection rule before dispatch. Use the requested worker count within available concurrency, queueing excess work. Inherit models unless explicit authorized preferences say otherwise. Give each writer an isolated checkout or output path and each verifier the exact revision and method.

Workers return PASS, ISSUES, or BLOCKED with concrete evidence. Missing required slices and failed workers are gaps. Verify the winning evidence and aggregate into one report with coverage, findings, dropouts, and selection rationale. Without delegation, execute the same passes sequentially and label that limitation. Do not claim independent review or cloud execution when neither occurred.
