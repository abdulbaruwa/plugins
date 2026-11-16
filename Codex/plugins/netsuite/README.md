# NetSuite for Codex

Community adaptation of upstream 1.0.0 from `third_party/netsuite`. Original authors, assets and MIT license are retained.

Require an authorized account-specific AI Connector Service URL: /all or the exact /suiteapp/<applicationid> suffix. Account ID uses domain form (lowercase, underscores to hyphens). Qualify native DCR client name/redirect and only mcp scope. Admin must enable SuiteScript/OAuth, tools SuiteApp and pending integration; standard records need REST Web Services. Use a dedicated non-admin role with MCP Connection, OAuth access-token and SuiteApp folder permissions. Honor ACLs, exact write authority, concurrency limits and the provider's ePHI exclusion.

Run `$netsuite:setup-netsuite` to complete supported configuration. No connection is enabled by this setup package.

Register `<repository>/Codex` as the marketplace, then install `netsuite@cursor-plugins-codex`. [Upstream README](references/upstream-readme.md) is reference evidence; its client-specific setup instructions do not override the native qualifications above. Provider authentication and live tools are unverified.
