---
name: dyl-review
description: "Draft a terse evidence-based review of one or more PRs, with up to seven actionable asks and a clear readiness verdict."
---

# Dyl review

Read ../../references/codex-runtime.md. Resolve each PR's actual base and head revision, inspect its full diff, body, requirements, and relevant repository instructions. Quick review applies correctness, simplicity, types, concurrency/performance, boundaries, observability, and tests. Deep review adds separate correctness/security and code-quality passes using Thermos when installed and available, plus Codex review when the CLI supports it. State missing review lanes rather than assuming a Bugbot agent exists.

Delegate independent read-only passes when available and authorized. Inherit parent models. Recheck every proposed finding against actual code, deduplicate, and keep only issues that are real, in scope, and worth the author's time. Never post the review or change the PR under this drafting skill.

Return one block per PR: title and URL, a green/yellow/red verdict identifying nits or blockers, 2 to 4 sentences about behavior and shape, and at most seven short actionable asks anchored to file/line. Zero asks is valid. On re-review, inspect the new head and track which earlier findings remain.
