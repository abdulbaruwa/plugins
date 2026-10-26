---
name: setup-framer
description: "Configure Framer for Codex after verifying provider authentication, native client compatibility, and required settings."
---

# Set up Framer

Framer accepts localhost or HTTPS OAuth redirects, while native client callback compatibility is unverified. Verify the exact redirect and supported registration before connecting; never substitute Cursor hosted placement. Publishing a site requires explicit user authority.

Read ../../references/upstream-mcp.json as upstream configuration evidence. It is not a loadable Codex configuration. Identify the tenant URL, credential variable names, and any OAuth client registration requirements.

Verify supported authentication against current official Codex MCP and provider documentation before editing configuration. If ../../references/config.example.toml exists, use it as the starting point, preserving unrelated settings. Keep credentials in the environment or client credential store. Resolve templated URLs to the actual tenant endpoint. For registered OAuth clients, register one for Codex; upstream application IDs belong to the upstream application. Do not substitute dynamic registration for a provider that requires a registered client.

Configure the server when necessary details are available. Start OAuth with the supported client flow or check that credential variables are set without printing values. Test a read-only tool and report the result. Missing credentials or registration mean incomplete setup. This package does not provide a connected service before setup.
