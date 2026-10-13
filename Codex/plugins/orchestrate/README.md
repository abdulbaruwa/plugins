# Orchestrate for Codex

Community adaptation of `orchestrate` at upstream version `1.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Coordinate scoped Codex workers and verifiers with isolated writes and evidence-based handoffs.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$orchestrate`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Uses available native Codex delegation with isolated writes and verified handoffs. The Cursor cloud dispatcher, Slack adapter, and their lifecycle semantics are excluded.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add orchestrate@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$orchestrate:orchestrate`. Full names avoid collisions with skills from other plugins.
