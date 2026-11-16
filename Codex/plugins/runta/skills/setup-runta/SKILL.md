---
name: setup-runta
description: "Qualify and set up Runta for Codex with provider-specific native authentication."
---

# Set up Runta

Uses Client ID Metadata Documents (CIMD), not DCR. Stop until native CIMD support and the actual client identity/organization consent are verified; no ID, secret or API key should be invented. Preserve runtime:read/runtime:manage scopes and organization roles. Commands, runtime changes/deletion, checkpoint restores and port publication require concrete authority; published URLs are public. Accepted lifecycle requests require status checks before claiming completion. Do not expose credentials, copy local files or claim secret/billing/member-management tools.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not executable native configuration. Verify current official native/provider authentication before editing. Use ../../references/config.example.toml only after resolving placeholders and supported settings. Preserve unrelated configuration, keep secrets in the environment or credential store and never print values. Missing registration, identity or authentication support means stop and report incomplete setup. With user authority, test only a scoped read before claiming tools work.
