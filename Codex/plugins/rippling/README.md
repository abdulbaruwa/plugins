# Rippling for Codex

Community adaptation of `third_party/rippling` at upstream version `1.0.0`. Original authors, assets and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Look up people, time off, and company policy in Rippling, and file time-off requests and draft hires.

## Scope and proof

Ask for the employee's Remote MCP server URL from Rippling → My IT → MCP connectors. Verify that it is the first-party Rippling workforce MCP, not the separate MCP Gateway or another host. Do not substitute a company-wide API token. An admin access policy and active Rippling AI trial/subscription are required. Use employee OAuth and verify the provider-supported native client flow; there is no upstream client ID or secret to copy. Discover the connected user's authorized codemode.* functions rather than inventing them. Preview and obtain user authority for official time-off requests, draft hires, and custom-object writes before executing them.

Static packaging does not establish installation, authentication, account entitlements or live tool behavior.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add rippling@cursor-plugins-codex
```

Run `$setup-rippling` to complete supported configuration before connecting.
