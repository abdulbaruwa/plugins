# Runta for Codex

Community adaptation of upstream 1.0.0 from `third_party/runta`. Original authors, assets and MIT license are retained.

Uses Client ID Metadata Documents (CIMD), not DCR. Stop until native CIMD support and the actual client identity/organization consent are verified; no ID, secret or API key should be invented. Preserve runtime:read/runtime:manage scopes and organization roles. Commands, runtime changes/deletion, checkpoint restores and port publication require concrete authority; published URLs are public. Accepted lifecycle requests require status checks before claiming completion. Do not expose credentials, copy local files or claim secret/billing/member-management tools.

Run `$runta:setup-runta` to complete supported configuration. No connection is enabled by this setup package.

Register `<repository>/Codex` as the marketplace, then install `runta@cursor-plugins-codex`. [Upstream README](references/upstream-readme.md) is reference evidence; its client-specific setup instructions do not override the native qualifications above. Provider authentication and live tools are unverified.
