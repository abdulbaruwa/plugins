# Continual Learning for Codex

Community adaptation of `continual-learning` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

On-demand updates to repository AGENTS.md from explicitly requested scoped chat learning.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$continual-learning`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Learning runs only when requested, uses a scoped corpus, and preserves existing repository instructions. No transcript hook is installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add continual-learning@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$continual-learning:continual-learning`. Full names avoid collisions with skills from other plugins.
