# Origin Apps for Codex

Community adaptation of `origin-apps` at upstream version `0.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Use Codex to work with the external Cursor Origin API; this does not replace that API.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$origin-api`, `$port-github-app-to-origin`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Cursor Origin remains an external API. This skill can help work with it from Codex; it does not replace that service.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add origin-apps@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$origin-apps:origin-api`. Full names avoid collisions with skills from other plugins.
