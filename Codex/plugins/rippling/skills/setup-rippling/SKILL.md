---
name: setup-rippling
description: "Configure Rippling for Codex after verifying the provider endpoint, permissions and native authentication."
---

# Set up Rippling

Ask for the employee's Remote MCP server URL from Rippling → My IT → MCP connectors. Verify that it is the first-party Rippling workforce MCP, not the separate MCP Gateway or another host. Do not substitute a company-wide API token. An admin access policy and active Rippling AI trial/subscription are required. Use employee OAuth and verify the provider-supported native client flow; there is no upstream client ID or secret to copy. Discover the connected user's authorized codemode.* functions rather than inventing them. Preview and obtain user authority for official time-off requests, draft hires, and custom-object writes before executing them.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not an executable configuration. Verify current official Codex MCP and provider requirements before editing configuration. Use ../../references/config.example.toml only after replacing its placeholders with the authorized endpoint. Preserve unrelated settings and never print credentials. Complete native OAuth only under the user's setup authority, then test an authorized read-only tool and report the actual result. Missing configuration or authentication remains incomplete setup.
