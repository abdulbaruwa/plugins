# dyl-stack for Codex

Community adaptation of `dyl-stack` at upstream version `0.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Dylan's agent style on top of pstack: root causes over symptom patches, The Algorithm before design, terse verified delivery, a PR review that fits in a paste, and Figma-to-UI with a visual judge.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$build-figma`, `$dyl-mode`, `$dyl-ready-pr`, `$dyl-review`, `$principle-the-algorithm`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add dyl-stack@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$dyl-stack:build-figma`. Full names avoid collisions with skills from other plugins.
