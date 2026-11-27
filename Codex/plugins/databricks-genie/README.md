# Databricks Genie for Codex

Community adaptation of upstream 1.1.0 from `third_party/databricks-genie`. Original authors, assets and MIT license are retained.

Renamed from databricks-genie-one; the endpoint still ends in system.ai.genie_one_mcp. Requires the bare workspace hostname and an admin-registered native OAuth client with ai-gateway/offline_access; no DCR. The secret is optional. Verify native redirect support and signed-in user access; do not modify existing saved configuration as part of this rename.

Run `$databricks-genie:setup-databricks-genie` to complete supported configuration. No connection is enabled by this setup package.

Register `<repository>/Codex` as the marketplace, then install `databricks-genie@cursor-plugins-codex`. [Upstream README](references/upstream-readme.md) is reference evidence; its client-specific setup instructions do not override the native qualifications above. Provider authentication and live tools are unverified.
