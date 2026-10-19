---
name: setup-pstack
description: Configure which models pstack uses per role and at what reasoning budget. Writes a user-level rule that overrides the skill defaults. Use for /setup-pstack, "configure pstack models", "pstack budget", or changing pstack's model choices.
---

# Setup pstack

Write `~/.claude/rules/pstack-models.md`, a user-level rule (Claude Code loads `~/.claude/rules/` in every project) that sets pstack's model per role.

## Steps

### 1. Know the available models

Claude Code subagents take a model alias in the Agent tool's `model` parameter: `opus`, `sonnet`, `haiku`, and `fable`. Those are the only values to write, plus `inherit-parent` and `auto`, which both mean: omit `model` so the subagent runs on the session's model. Never write a full model ID or another tool's slug.

### 2. Load current state

The default role-to-model mapping is the rule shape shown in step 5 below. If `~/.claude/rules/pstack-models.md` already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in step 5, such as `how critics`, is from a retired role. Drop it.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Prefer AskUserQuestion over free text. Offer these four options with these exact labels, and name the current budget when the rule records one. With no rule, say that `large` matches the skill defaults.

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) Apply it.** The budget sets the tier of each role and the effort written on the `# budget` line:

| Budget | Code roles | Judgment and prose roles | Panels (two families for a real second opinion) | Effort |
| --- | --- | --- | --- | --- |
| `unlimited` | `opus` | `opus` | `opus, sonnet` | `max` |
| `large` | `sonnet` | `opus` | `opus, sonnet` | `xhigh` |
| `medium` | `sonnet` | `sonnet` | `sonnet, haiku` | `high` |
| `small` | `haiku` | `sonnet` | `sonnet, haiku` | `medium` |

Code roles are `feature, refactoring`, `bug-fix`, `perf-issue`, `hillclimb`, `how explorer`, `why investigators`, `reflect tooling`, and `swarm workers`. Judgment and prose roles are `judgment and prose`, `hardest tasks`, `how explainer`, `why synthesizer`, and `reflect judgment, divergent, synthesizer`. Panels are `arena runners`, `arena cross-judge pool`, `architect runners`, and `interrogate reviewers`.

On a re-run, a role is hand-set when its value is `inherit-parent` or `auto`, or differs from what the table gives that role under the rule's old `# budget` line (with no `# budget` line, compare against `large`). Keep hand-set roles as they are, and give every other role the new budget's value.

**(c) Show the roles and confirm.** Show every role with its model, and list each line step 2 dropped. Ask whether to accept as-is or change specific roles. For each role the user wants to change, ask with AskUserQuestion, which allows at most four options: offer `opus`, `sonnet`, `haiku`, and `inherit-parent`, and say that `fable` or `auto` can be typed as the other answer. For panel roles the value is a list, and one subagent runs per entry, alias entries included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena selects one value from it that differs from the parent's model when possible. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every value must be `opus`, `sonnet`, `haiku`, `fable`, `inherit-parent`, or `auto`. If the user names anything else, map it to the closest alias, say so, and ask again only if nothing fits.

### 5. Write the rule

Write `~/.claude/rules/pstack-models.md` with a `# budget` line naming the chosen label and its effort, and one line per role, using the same labels poteto-mode uses. Overwrite the whole file so re-runs stay idempotent. Shape:

```
# pstack model configuration (overrides skill defaults). One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the session's model (omit Agent `model`). Alias entries in a panel list still count toward its fan-out.
# When the Agent tool accepts an `effort` parameter, pass the budget's effort to every pstack subagent; otherwise subagents use the session's effort.
# budget: large (xhigh)
feature, refactoring: sonnet
bug-fix: sonnet
perf-issue: sonnet
hillclimb: sonnet
judgment and prose: opus
hardest tasks: opus
how explorer: sonnet
how explainer: opus
why investigators: sonnet
why synthesizer: opus
reflect tooling: sonnet
reflect judgment, divergent, synthesizer: opus
arena runners: opus, sonnet
arena cross-judge pool: opus, sonnet
swarm workers: sonnet
architect runners: opus, sonnet
interrogate reviewers: opus, sonnet
```

### 6. Confirm

Tell the user the rule was written and that it applies to new sessions. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /pstack:create-verification-skill." On yes, read and follow `../create-verification-skill/SKILL.md` (it is user-only, so the Skill tool will not load it). On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

If the project has no skill running a model checker, proof, or code-level verifier against named code, offer once to create one with `/pstack:create-formal-verification-skill`. On acceptance, read and follow `../create-formal-verification-skill/SKILL.md`; it is user-only, so the Skill tool does not load it. On decline, continue without pushing. Existing checks that no longer describe their code use `../maintain-formal-verification-skill/SKILL.md`. A generated-input fallback is not a formal proof.
