# Front for Codex

Community adaptation of upstream 1.1.1. Original author, assets and license are retained.

Front 1.1.1 removes credential fields because Cursor now supplies its OAuth client and scope. That does not establish DCR or native registration. Qualify the current provider-supported own-client identity and exact native redirect first; stop without a native recipe if unsupported. Preserve feature:mcp and minimum separate read/write/send permissions, reconnect after permission changes, current teammate/inbox ACLs and rate-limit waits (100/200/300 tools per minute by plan). Drafts and internal comments differ from immediate sends: confirm exact recipients/content before sending.

No native connection is enabled. Run $setup-front after installation. [Upstream README](references/upstream-readme.md) records source evidence, not accepted native setup.
