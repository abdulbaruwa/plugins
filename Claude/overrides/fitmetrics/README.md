# FitMetrics for Claude Code

FitMetrics connects to ABC Trainerize for client, check-in, measurement, meal, and workout reads and authorized coaching changes. FitMetrics Scale is required.

1. In **FitMetrics → Settings → Integrations → MCP**, select **Create API Key → Other MCP app**. Choose the coach and tool permissions needed. A coach key reaches only their assigned clients.
2. Install FitMetrics from the Claude marketplace linked above. Enter the key in the plugin's required sensitive **FitMetrics API key** configuration prompt. Keep the value out of chat, Git, and plaintext examples. The generated server sends it to `https://app.fitmetrics.ai/mcp` as a bearer credential. This port uses the API key path and does not assume native OAuth compatibility.
3. Once the user authorizes the connection, verify the connected coach and try only a read within the requested scope. Tool availability depends on the provider and key.

An owner or admin must enable writes in FitMetrics. Before any specific change or outbound message, preview its client, content, and effects and obtain the user's authority. Treat client data as private. Packaging checks do not establish entitlement, authentication, or live tool access.

For provider setup details, see [FitMetrics MCP documentation](https://app.fitmetrics.ai/docs/faq/connect-ai-tools-to-fitmetrics-via-mcp-claude-chatgpt-openclaw-more). The original logo, author, and MIT license are retained.
