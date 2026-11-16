---
name: setup-netsuite
description: "Qualify and set up NetSuite for Codex with provider-specific native authentication."
---

# Set up NetSuite

Require an authorized account-specific AI Connector Service URL: /all or the exact /suiteapp/<applicationid> suffix. Account ID uses domain form (lowercase, underscores to hyphens). Qualify native DCR client name/redirect and only mcp scope. Admin must enable SuiteScript/OAuth, tools SuiteApp and pending integration; standard records need REST Web Services. Use a dedicated non-admin role with MCP Connection, OAuth access-token and SuiteApp folder permissions. Honor ACLs, exact write authority, concurrency limits and the provider's ePHI exclusion.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not executable native configuration. Verify current official native/provider authentication before editing. Use ../../references/config.example.toml only after resolving placeholders and supported settings. Preserve unrelated configuration, keep secrets in the environment or credential store and never print values. Missing registration, identity or authentication support means stop and report incomplete setup. With user authority, test only a scoped read before claiming tools work.
