---
name: setup-mixpanel
description: "Qualify and set up Mixpanel for Codex with provider-specific native authentication."
---

# Set up Mixpanel

Select the organization's US mcp.mixpanel.com, EU mcp-eu.mixpanel.com or IN mcp-in.mixpanel.com host; never infer or change residency. Uses OAuth PKCE/DCR, not a service-account header. Verify project access and admin AI/MCP enablement, which may take 15 minutes; query limits apply. Confirm each dashboard, metadata, cohort, experiment or flag write. Keep unverified-entity markers; unsupported audience targeting is not supplied.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not executable native configuration. Verify current official native/provider authentication before editing. Use ../../references/config.example.toml only after resolving placeholders and supported settings. Preserve unrelated configuration, keep secrets in the environment or credential store and never print values. Missing registration, identity or authentication support means stop and report incomplete setup. With user authority, test only a scoped read before claiming tools work.
