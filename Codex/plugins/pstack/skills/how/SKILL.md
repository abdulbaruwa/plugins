---
name: how
description: "Explain subsystem architecture and runtime flow from code evidence before changing it or onboarding a reader."
---

# How

Read ../../references/codex-runtime.md. For a narrow question, trace the relevant entrypoint and explain it directly. For a cross-cutting subsystem, partition into 2 to 4 evidence slices using references/explorer-prompt.md. Delegate when available and authorized, or explore sequentially. Synthesize with references/explainer-prompt.md, checking file pointers and actual runtime paths.

Explain the purpose, core concepts, flow, ownership, and gotchas at the level needed for a working mental model. Mark missing runtime evidence. Use ../why/SKILL.md for historical motivation rather than inferring intent from today's implementation.
