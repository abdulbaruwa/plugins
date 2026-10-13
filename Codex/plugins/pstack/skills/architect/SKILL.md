---
name: architect
description: "Sketch usage, types, interfaces, and ownership boundaries before implementing a nontrivial design."
---

# Architect

Read ../../references/codex-runtime.md. Ground the existing subsystem with ../how/SKILL.md and trace rationale with ../why/SKILL.md when ownership or constraints are changing. Write the caller's usage first. Sketch types, signatures, module boundaries, invariants, and pseudocode. Use ../arena/SKILL.md to compare at least two whole-shape designs. Evaluate references/design-red-flags.md and capture the decision in references/rationale-template.md.

Proceed within the requested implementation scope; stop at a design checkpoint if the user asked for one. Replace temporary sketches with working code and verify the observable behavior. If repeated implementation deviations show the architecture is wrong, revisit the design and subtract complexity before adding special cases. A design-only request ends with the reviewed sketch and validation plan.
