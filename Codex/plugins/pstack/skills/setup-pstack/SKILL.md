---
name: setup-pstack
description: "Configure pstack preferences for Codex using confirmed session capabilities and inherited model defaults."
---

# Set up pstack

Read ../../references/codex-runtime.md. Confirm which Codex surfaces and delegation tools are available. Default all roles to inherited parent intelligence. If the user explicitly requests model overrides, resolve supported model IDs and reasoning efforts from current session capabilities or official docs; show the concrete choices before recording them.

Record requested role preferences in a project-owned .codex/pstack/preferences.json, preserving unrelated fields. Describe this as workflow preference data, not a Codex configuration key. Workflow skills read it on invocation; it is not an automatically applied rule. Honor existing approval and invocation policy. Do not rewrite global Codex config or invent Cursor model identifiers. Report the saved path and missing capabilities.

If the project has no real-app verification skill or harness, offer once to use ../create-verification-skill/SKILL.md. Separately, if it has no formal verification skill, offer once to use ../create-formal-verification-skill/SKILL.md for a code-linked property with explicit bounds. Follow either workflow only if the user accepts; declining does not block setup. Use ../maintain-formal-verification-skill/SKILL.md when existing formal checks have drifted from their covered code.
