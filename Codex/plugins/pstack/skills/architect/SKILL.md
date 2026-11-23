---
name: architect
description: "Sketch usage, types, interfaces, and ownership boundaries before implementing a nontrivial design."
---

# Architect

Read ../../references/codex-runtime.md. Trace every system the change touches, grounding behavior with ../how/SKILL.md and rationale with ../why/SKILL.md when ownership or constraints change. Write the caller's usage first. Sketch two different shapes with types, signatures, module boundaries, and invariants. Prefer the shape with one owner for each state, one way to perform each task, and the least knowledge required of callers.

For a large or contested design, use ../arena/SKILL.md instead of sketching alone. Optional references/design-red-flags.md, references/rationale-template.md, and references/runner-prompt.md support the comparison when a durable rationale or delegated candidate is useful. They do not require a fan-out for a small design.

Proceed within the requested implementation scope; stop at a design checkpoint if the user asked for one. Replace temporary sketches with working code and verify the observable behavior. If repeated implementation deviations show the architecture is wrong, revisit the design and subtract complexity before adding special cases. A design-only request ends with the reviewed sketch and validation plan.
