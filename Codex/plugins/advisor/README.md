# Advisor for Codex

Community adaptation of `advisor` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

User-requested read-only second opinions using available Codex delegation.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$advisor`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Advice is requested in the current conversation. No transcript watcher, persistent advisor binding, or automatic nudge is installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add advisor@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$advisor:advisor`. Full names avoid collisions with skills from other plugins.
