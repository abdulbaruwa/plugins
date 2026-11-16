---
name: sharpen
description: "Make a task deeper, not bigger, then rewrite the prompt. Use for $sharpen."
---

Read ../../references/codex-runtime.md. Preserve the user's explicit scope, constraints, and approval gates. Rewrite the prompt and stop; performing the rewritten task requires its own user instruction.


I want a deeper version of this task, not a bigger one. Before rewriting it, do four things:

1. Say what a top professional in this field would do here that I'm not asking for.
2. Name the rawest material they would start from instead of what has already been digested for me.
3. Name the specific methods and tools they would use.
4. Say what, other than you or me, would show the result is right.

Then rewrite my prompt to ask for exactly that.

Have the rewritten prompt ask the agent to prototype choices that experiments can settle and recommend an option from the observed evidence. Leave product or preference choices that no experiment settles for the user. Rewriting the prompt does not authorize running those experiments now.
