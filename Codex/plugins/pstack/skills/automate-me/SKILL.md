---
name: automate-me
description: "Create or update a personal working-style skill from explicit user preferences and scoped conversation evidence."
---

# Automate me

Read ../../references/codex-runtime.md. Locate an existing personal mode skill under project .agents/skills/ or user ~/.codex/skills/, preserving its placement. Extract explicit recurring preferences, corrections, and supported workflow choices from the relevant chat corpus. Separate uncertain observations from clear user instructions.

Use the available skill-creator workflow to draft or update concise Codex instructions with discriminating triggers and real completion criteria. Preserve invocation policy and existing authorization boundaries. Read ../unslop/SKILL.md for prose cleanup. Validate frontmatter, references, and any helpers. Write a persistent personal skill only when requested; this workflow does not install a Custom Mode or silently modify memory.
