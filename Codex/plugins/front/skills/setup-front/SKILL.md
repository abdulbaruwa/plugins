---
name: setup-front
description: "Qualify and set up Front for Codex with provider-specific native authentication."
---

# Set up Front

An admin must create a confidential Front app with the MCP feature, own client ID and secret, feature:mcp scope and actual native callback. DCR is unsupported. Resource read/write/send permissions are separate; request minimum access and reconnect after permission changes. Confirm exact recipients and content for sends. Distinguish drafts and internal comments, honor inbox/user permissions and rate-limit waits.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not executable native configuration. Verify current official native/provider authentication before editing. Use ../../references/config.example.toml only after resolving placeholders and supported settings. Preserve unrelated configuration, keep secrets in the environment or credential store and never print values. Missing registration, identity or authentication support means stop and report incomplete setup. With user authority, test only a scoped read before claiming tools work.
