# pstack for Codex

Community adaptation of `pstack` at upstream version `0.15.46`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

if you want to go fast, go deep first. pstack helps you write less, but higher quality code. rigorous agent workflows you can parallelize with confidence.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

`$pstack:ketchup` catches the user up on changes in this chat with plain words and useful visuals, listing every waiting item with enough evidence, recommendation, and risk to decide from the reply.

Packaged skills: `$architect`, `$arena`, `$automate-me`, `$benchmark-checklist`, `$blast-radius`, `$bro`, `$correct`, `$create-formal-verification-skill`, `$create-verification-skill`, `$figure-it-out`, `$how`, `$in-your-own-words`, `$interrogate`, `$ketchup`, `$ketchup-video`, `$maintain-formal-verification-skill`, `$maintain-verification-skill`, `$make-bot-ui`, `$no-comments`, `$poteto-help`, `$poteto-mode`, `$principle-attack-the-premise`, `$principle-boundary-discipline`, `$principle-build-the-lever`, `$principle-encode-lessons-in-structure`, `$principle-exhaust-the-design-space`, `$principle-experience-first`, `$principle-explain-the-number`, `$principle-fix-root-causes`, `$principle-foundational-thinking`, `$principle-guard-the-context-window`, `$principle-laziness-protocol`, `$principle-make-operations-idempotent`, `$principle-migrate-callers-then-delete-legacy-apis`, `$principle-minimize-reader-load`, `$principle-model-the-domain`, `$principle-never-block-on-the-human`, `$principle-outcome-oriented-execution`, `$principle-prove-it-works`, `$principle-redesign-from-first-principles`, `$principle-separate-before-serializing-shared-state`, `$principle-sequence-verifiable-units`, `$principle-subtract-before-you-add`, `$principle-test-behavior-not-implementation`, `$principle-type-system-discipline`, `$recall`, `$reflect`, `$setup-pstack`, `$sharpen`, `$statechart`, `$show-me-your-work`, `$swarm`, `$tdd`, `$teach`, `$technical-writing`, `$typescript-best-practices`, `$unslop`, `$why`.

The current source is `7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9`, version 0.15.46. Read the [0.15.46 reconciliation decisions](references/upstream-update-0.15.46.md). The prior [0.15.36 update decisions](references/upstream-update-0.15.36.md) are historical; current verification is recorded in the upstream update PR.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Reusable principles and review procedures are retained with native runtime guidance. Cursor cloud scripts, Custom Modes, and webhook/Benny automation packs are excluded.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add pstack@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$pstack:architect`. Full names avoid collisions with skills from other plugins.

## Statechart runtime

`$pstack:statechart` includes the TypeScript compiler, corpus, and regression suite. Its launcher supports Node 22.18–22.x or 23.6+, Bun 1.1.5+, or Deno 2+. It uses existing `TLA2TOOLS` and `JAVA` paths when supplied; otherwise mise installs TLC and Java on first use. PNG/browser tooling is not required; optional SVG rendering uses Pele 1.9.0. Keep generated models and outputs in an owned scratch directory.

The 23 November reconciliation adds native Windows execution and CRLF parsing, concise principles and writing guidance, two-shape Architect sketches, scoped Reflect findings, and a package-local worker brief. Existing output-drain/cancellation fixes, optional research and design resources, native plan/orchestrate playbooks, inherited models, independent shipping gates, ownership and prompt-only Sharpen remain intact. Source model matrices and automatic defaults migrations are not installed as Codex configuration. Existing user preferences remain authoritative.

On native Windows, invoke `node --disable-warning=ExperimentalWarning <skill dir>/scripts/statechart.ts` with a supported Node version. The shell launcher remains available on POSIX systems. Packaging and CRLF regression results do not establish native Windows runtime acceptance.
