---
name: setup-servicenow
description: "Configure ServiceNow for Codex after verifying the provider endpoint, permissions and native authentication."
---

# Set up ServiceNow

Ask for the bare instance hostname and the exact MCP server name from its active server record. Do not infer a tenant or activate a server. An administrator must register a native authorization-code OAuth client with a secret, JWT token format and the mcp_server scope; dynamic registration is unsupported. Register the actual Codex redirect and keep the secret in the supported credential store. The connecting user needs sn_mcp_server.viewer and each tool's ACL. Preserve the provider's 26 KB request and 64 KB response limits. Preview writes and obtain user authority for the exact published tool before execution.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not an executable configuration. Verify current official Codex MCP and provider requirements before editing configuration. Use ../../references/config.example.toml only after replacing its placeholders with the authorized endpoint. Preserve unrelated settings and never print credentials. Complete native OAuth only under the user's setup authority, then test an authorized read-only tool and report the actual result. Missing configuration or authentication remains incomplete setup.
