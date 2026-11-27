# FreshBooks for Codex

Community adaptation of upstream 1.0.0 from third_party/freshbooks. Original author, assets and license are retained.

Qualify native OAuth/DCR against auth.freshbooks.com, with no shared client credentials inferred. Use least-privilege mcp:all:read; separately opt into mcp:revenue:write, mcp:payables:write, mcp:operations:write or mcp:books:write only for authorized work. Calls are limited by the signed-in user. Preview exact invoice, payment or accounting changes and obtain the corresponding authority. Removing a plugin and revoking the provider app are independent actions.

Install freshbooks@cursor-plugins-codex from <repository>/Codex. [Upstream README](references/upstream-readme.md) is source evidence; its client-specific configuration does not establish native acceptance. No provider is authenticated or live-tested by this port.
