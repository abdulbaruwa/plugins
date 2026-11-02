# ServiceNow for Codex

Community adaptation of `third_party/servicenow` at upstream version `1.0.0`. Original authors, assets and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Call the tools your admin publishes on a ServiceNow instance.

## Scope and proof

Ask for the bare instance hostname and the exact MCP server name from its active server record. Do not infer a tenant or activate a server. An administrator must register a native authorization-code OAuth client with a secret, JWT token format and the mcp_server scope; dynamic registration is unsupported. Register the actual Codex redirect and keep the secret in the supported credential store. The connecting user needs sn_mcp_server.viewer and each tool's ACL. Preserve the provider's 26 KB request and 64 KB response limits. Preview writes and obtain user authority for the exact published tool before execution.

Static packaging does not establish installation, authentication, account entitlements or live tool behavior.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add servicenow@cursor-plugins-codex
```

Run `$setup-servicenow` to complete supported configuration before connecting.
