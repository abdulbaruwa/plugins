# Create Plugin for Codex

Community adaptation of `create-plugin` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Author and validate portable Codex plugins and local marketplaces.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$create-plugin-scaffold`, `$review-plugin-submission`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add create-plugin@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$create-plugin:create-plugin-scaffold`. Full names avoid collisions with skills from other plugins.
