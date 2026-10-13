# Docs Canvas for Codex

Community adaptation of `docs-canvas` at upstream version `0.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Create navigable documentation as local HTML or a Markdown walkthrough.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$docs-canvas`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Produces ordinary HTML or Markdown documentation; no proprietary Canvas SDK is required.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add docs-canvas@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$docs-canvas:docs-canvas`. Full names avoid collisions with skills from other plugins.
