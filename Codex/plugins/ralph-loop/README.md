# Ralph Loop for Codex

Community adaptation of `ralph-loop` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Bounded iterative development in a Codex turn, with observable completion and cancellation.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$cancel-ralph`, `$ralph-loop`, `$ralph-loop-help`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Iteration runs in the current turn. Resumable state is owned by a chat and run; this package installs no automatic follow-up hook.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add ralph-loop@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$ralph-loop:cancel-ralph`. Full names avoid collisions with skills from other plugins.
