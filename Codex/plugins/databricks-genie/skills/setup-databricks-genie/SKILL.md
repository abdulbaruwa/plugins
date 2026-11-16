---
name: setup-databricks-genie
description: "Qualify and set up Databricks Genie for Codex with provider-specific native authentication."
---

# Set up Databricks Genie

Renamed from databricks-genie-one; the endpoint still ends in system.ai.genie_one_mcp. Requires the bare workspace hostname and an admin-registered native OAuth client with ai-gateway/offline_access; no DCR. The secret is optional. Verify native redirect support and signed-in user access; do not modify existing saved configuration as part of this rename.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not executable native configuration. Verify current official native/provider authentication before editing. Use ../../references/config.example.toml only after resolving placeholders and supported settings. Preserve unrelated configuration, keep secrets in the environment or credential store and never print values. Missing registration, identity or authentication support means stop and report incomplete setup. With user authority, test only a scoped read before claiming tools work.
