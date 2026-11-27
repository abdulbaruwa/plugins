---
name: setup-fitmetrics
description: "Set up the FitMetrics MCP connection for ABC Trainerize using a scoped FitMetrics API key."
---

# Set up FitMetrics

Check that the user has ABC Trainerize with FitMetrics Scale. Have them create a key in FitMetrics **Settings → Integrations → MCP → Create API Key → Other MCP app** and select only the coach and tool permissions needed for the task. A coach key reaches only assigned clients. FitMetrics write actions need owner or admin enablement; enablement is not authorization for a particular change.

Have the user supply `FITMETRICS_API_KEY` through a secure environment or supported secret store, never in chat, Git, or the config file. Check only whether it is available to the Codex process; do not read or print its value. Use [the native config example](../../references/config.example.toml) for the provider's HTTPS endpoint and bearer-token environment mapping. Preserve unrelated settings and check that the installed client supports the mapping before writing. [Upstream config](../../references/upstream-mcp.json) is source evidence only. Do not import Cursor interpolation or assume a native OAuth registration.

After the user authorizes the connection, verify the connected coach and use only a read operation within the assigned clients and requested scope. Treat client data as private. Preview and obtain authority for a particular write or outbound message, including its target and content, before calling a write tool. Report only what the connection and tool result establish.
