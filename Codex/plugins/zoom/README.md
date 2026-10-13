# Zoom for Codex

Community adaptation of `third_party/zoom` at upstream version `1.0.1`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Search meetings, pull transcripts, and work with Zoom Docs.

Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled.

Packaged skills: `$setup-zoom`.

## Scope and proof

Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add zoom@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$zoom:setup-zoom`. Full names avoid collisions with skills from other plugins.

Run `$zoom:setup-zoom` to complete the provider configuration. The bundled `references/upstream-mcp.json` is evidence, not an enabled connection; credentials belong in supported native client configuration.
