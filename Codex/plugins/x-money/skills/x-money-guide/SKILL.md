---
name: x-money-guide
description: "Work with a configured X Money MCP connection only after verifying supported authentication and the exact user-requested action."
---

# X Money MCP

Inspect the provider's current authentication requirements and available tools. The packaged endpoint is configuration evidence, not proof that Codex can complete the Grok Bot enrollment flow. If the host-specific enrollment is required, report it as a connection blocker and use an independently supported provider flow when available.

Use read-only account tools for requested queries. For payments, purchases, or requests for money, establish recipient, amount, currency, fees, and purpose, and obtain any missing authorization through the available user-input flow before the external action. Respect already explicit user decisions. Keep passkeys, codes, tokens, and financial identifiers out of logs and generated artifacts. Verify the actual tool result and transaction status; a submitted request alone does not prove settlement. Preserve provider errors and give the next supported step without invented app buttons or approval widgets.
