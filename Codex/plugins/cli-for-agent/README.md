# CLI for Agents for Codex

Community adaptation of `cli-for-agent` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Patterns for designing CLIs that coding agents can run reliably: non-interactive flags, layered help with examples, pipelines, actionable errors, idempotency, and dry-run.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$cli-for-agents`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add cli-for-agent@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$cli-for-agent:cli-for-agents`. Full names avoid collisions with skills from other plugins.
