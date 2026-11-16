# Front for Codex

Community adaptation of upstream 1.0.0 from `third_party/front`. Original authors, assets and MIT license are retained.

An admin must create a confidential Front app with the MCP feature, own client ID and secret, feature:mcp scope and actual native callback. DCR is unsupported. Resource read/write/send permissions are separate; request minimum access and reconnect after permission changes. Confirm exact recipients and content for sends. Distinguish drafts and internal comments, honor inbox/user permissions and rate-limit waits.

Run `$front:setup-front` to complete supported configuration. No connection is enabled by this setup package.

Register `<repository>/Codex` as the marketplace, then install `front@cursor-plugins-codex`. [Upstream README](references/upstream-readme.md) is reference evidence; its client-specific setup instructions do not override the native qualifications above. Provider authentication and live tools are unverified.
