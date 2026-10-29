---
name: interrogate
description: "Adversarially review a scoped change against requirements and return verified findings without applying fixes automatically."
---

# Interrogate

Read ../../references/codex-runtime.md. Freeze the review scope and the user's intent. If no scope is named, use the branch diff from its merge base through the working tree. Read ../in-your-own-words/SKILL.md to restate the intent from the request, commits, and PR description. Clarify intent only when the available evidence cannot resolve it.

Give each authorized adversary an isolated worktree or scratch checkout, including a copy of scoped uncommitted changes. Keep the user's checkout read-only. Use the current session's ordinary subagents and inherit parent models unless the user has explicitly configured supported alternatives. If delegation is unavailable or unauthorized, perform separate sequential passes and disclose the lack of independent reviewers.

Each adversary tries to break the change. Keep only findings proven by a run against the real code: a failing test, a repro script, or command output showing behavior that violates the stated intent. For a design, run a prototype or probe the current tree. Repros belong in the adversary's own checkout. Each candidate finding gives its title, exact command, actual output, and required output. Leave out unrun speculation, style preferences, and risks that need a future change to matter. No findings is a valid result.

Rerun each candidate's command yourself at the reviewed revision. Keep it only if the observed failure breaks the intent; deduplicate findings with one root cause. Keep every verified finding rather than selecting one reviewer's list. Do not fix product code automatically.

Return the intent, prioritized verified findings with paths and commands, actual versus required output, and reviewer attribution. Say "no verified findings" when none survive. Give each reviewer's dropped-finding count and reasons, and disclose checks that could not run. Do not equate no verified findings with proof of correctness.
