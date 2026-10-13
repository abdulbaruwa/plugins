---
name: interrogate
description: "Adversarially review a scoped change against requirements and return verified findings without applying fixes automatically."
---

# Interrogate

Read ../../references/codex-runtime.md. Freeze the review scope, base and head revisions, requirements, and applicable standards. Use the rubrics in references/ to challenge behavior, invariants, scope, and maintainability. Use independent read-only reviewers when available and authorized; otherwise perform distinct sequential passes and state that limitation. Inherit parent models unless explicitly configured.

Reproduce or inspect every candidate finding. Drop speculative issues, deduplicate overlaps, and resolve disagreements from code and evidence. Return prioritized findings with paths, trigger, consequence, and practical remediation, plus exact checks and gaps. Do not auto-apply review suggestions or create unrelated PRs to change model configuration.
