# Gong for Codex

Community adaptation of `third_party/gong` at upstream version `1.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Pull account summaries, deal insights, and call briefs.

Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled.

Packaged skills: `$setup-gong`.

## Scope and proof

Credentials, OAuth client registration, or tenant URL require Codex-native setup. No placeholder MCP connection is enabled.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add gong@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$gong:setup-gong`. Full names avoid collisions with skills from other plugins.

Run `$gong:setup-gong` to complete the provider configuration. The bundled `references/upstream-mcp.json` is evidence, not an enabled connection; credentials belong in supported native client configuration.

Gong 1.1.0 requires a supported HTTPS OAuth redirect and your own registered MCP client. Its optional credentials apply to Grok auto-registration, not a native support guarantee. Stop before configuring or signing in if the installed native client cannot satisfy the HTTPS callback; do not reuse Cursor callbacks or credentials.
