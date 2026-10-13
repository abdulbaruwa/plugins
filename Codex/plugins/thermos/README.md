# Thermos for Codex

Community adaptation of `thermos` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Thermo-nuclear branch review: deep correctness and security audits plus harsh code-quality rubrics, parallel subagents, thermos orchestration, and optional take-the-wheel and FSD merge-ready flows.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$thermo-nuclear-code-quality-review`, `$thermo-nuclear-review`, `$thermos`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add thermos@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$thermos:thermo-nuclear-code-quality-review`. Full names avoid collisions with skills from other plugins.
