---
name: setup-zoom
description: Configure Zoom for Codex using provider MCP details and credentials. Use when setting up this plugin.
---

# Set up Zoom

Read ../../references/upstream-mcp.json as upstream configuration evidence. It is not a loadable Codex configuration. Identify the tenant URL, credential variable names, and any OAuth client registration requirements.

Verify supported authentication against current official Codex MCP and provider documentation before editing configuration. If ../../references/config.example.toml exists, use it as the starting point, preserving unrelated settings. Keep credentials in the environment or client credential store. Resolve templated URLs to the actual tenant endpoint. For registered OAuth clients, register one for Codex; upstream application IDs belong to the upstream application. Do not substitute dynamic registration for a provider that requires a registered client.

Configure the server when necessary details are available. Start OAuth with the supported client flow or check that credential variables are set without printing values. Test a read-only tool and report the result. Missing credentials or registration mean incomplete setup. This package does not provide a connected service before setup.

Zoom's upstream 1.0.2 setup requires both client ID and client secret in its ordinary client flow. A desktop loopback flow requires the appropriate public client and a `127.0.0.1` redirect; upstream explicitly says Zoom rejects `localhost`. Confirm the exact redirect produced by the current Codex client and the provider's registered client before connecting. If the client cannot satisfy it, report setup blocked rather than substituting a different redirect or treating an empty secret as a successful setup. Each user still needs the relevant Zoom product permissions.
