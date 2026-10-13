---
name: x-api-mcp-guide
description: "Use a configured X MCP connection for user-requested reads or actions, verifying tool availability, account access, and current API costs."
---

# X MCP guide

Run ../setup-x/SKILL.md when the connection is not configured. Inspect the available X tools and current provider documentation before using an operation. Codex does not inherit Grok public-read access, Cursor subscription credits, or X Chat enrollment. Confirm the connected account for private reads and writes.

Use read-only calls for the user's research request. Before chargeable or external actions, determine the concrete cost and action details from current provider responses and follow the user's authorization. Treat absent credit or chat tools as unavailable capabilities, not proof of an account failure. Keep credentials and chat keys in supported client storage. Use only authenticated methods exposed by the actual connection; do not invent a secret-request widget or read Grok credential files. Report evidence, gaps, and actions actually performed.
