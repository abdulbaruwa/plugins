# PR Review Canvas for Codex

Community adaptation of `pr-review-canvas` at upstream version `0.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Create a self-contained HTML PR walkthrough grouped by reviewer value.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$pr-review-canvas`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Produces a local HTML walkthrough using the bundled renderer; no proprietary Canvas SDK is required.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add pr-review-canvas@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$pr-review-canvas:pr-review-canvas`. Full names avoid collisions with skills from other plugins.
