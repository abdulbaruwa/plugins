# Codex SDK for Codex

Community adaptation of `cursor-sdk` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Build server-side tools and CI workflows with the Codex SDK.

Native Codex SDK authoring workflow replaces Cursor SDK API guidance; original source API and examples are not copied.

Packaged skills: `$codex-sdk`.

## Scope and proof

Native Codex SDK authoring workflow replaces Cursor SDK API guidance; original source API and examples are not copied.

Uses current native Codex SDK guidance. Cursor SDK APIs and cloud-agent lifecycle are not copied.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add codex-sdk@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$codex-sdk:codex-sdk`. Full names avoid collisions with skills from other plugins.
