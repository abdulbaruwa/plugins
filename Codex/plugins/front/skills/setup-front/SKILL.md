---
name: setup-front
description: "Qualify native Front registration and authorized tools before setup."
---

# Set up Front

Front 1.1.1 removes credential fields because Cursor now supplies its OAuth client and scope. That does not establish DCR or native registration. Qualify the current provider-supported own-client identity and exact native redirect first; stop without a native recipe if unsupported. Preserve feature:mcp and minimum separate read/write/send permissions, reconnect after permission changes, current teammate/inbox ACLs and rate-limit waits (100/200/300 tools per minute by plan). Drafts and internal comments differ from immediate sends: confirm exact recipients/content before sending.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as source evidence, not active configuration. Preserve unrelated settings, keep credentials in the environment or credential store and never print them. Stop when native identity, callback or entitlement support is unproved. With user authority, test only a scoped read first.
