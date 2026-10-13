---
name: no-comments
description: "Review comments for obsolete narration and unenforced constraints, preserving required and evidence-backed guidance."
---

# Review comments

Read ../../references/codex-runtime.md and ../../references/agents/comment-sicko.md as a review rubric. Scope the pass to the user's files or diff. Run a read-only review first. Distinguish obsolete narration from licensing, generated-file guidance, external constraints, safety notes, suppression rationale, and meaningful invariants.

Verify each proposed deletion and any claimed constraint in code. Remove stale narration only within authorized scope. Prefer enforcing real invariants through types, focused tests, or existing checks before deleting guidance. Preserve an unresolved safety or external constraint until it is understood and appropriately enforced. Root-cause code changes need the same scope and validation as any fix. Report deleted comments, retained constraints, proven issues, and uncompleted work.
