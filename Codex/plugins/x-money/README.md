# X Money for Codex

Community adaptation of `third_party/x-money` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Provider MCP endpoint and cautious capability-aware workflow; Codex enrollment is unverified.

Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified.

Packaged skills: `$x-money-guide`.

## Scope and proof

Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified.

The provider endpoint is packaged, but Codex enrollment is unverified. Grok Bot enrollment is not assumed to work in Codex.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add x-money@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$x-money:x-money-guide`. Full names avoid collisions with skills from other plugins.
