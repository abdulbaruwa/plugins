# Jobber for Codex

Community adaptation of upstream 1.0.0 from third_party/jobber. Original author, assets and license are retained.

Jobber requires an own registered OAuth app with client ID and secret; DCR is unsupported. Verify the actual native callback instead of copying Cursor callbacks. Core, Connect, Grow and Plus plans apply; each user signs in with their own permissions through supported user-mediated OAuth, never a browser agent. Clients, properties and requests can be created/edited. Quotes are CREATE-ONLY with total, deposit and discount, no unit costs or margins, and cannot be edited afterward. Jobs, invoices and schedule are read-only; no record deletion/archive. Preview and authorize exact customer-record changes. Preserve the nine advertised client/request/quote/job/invoice/visit read/write scopes; request only those needed.

No connection is enabled. Run $setup-jobber after installation. [Upstream README](references/upstream-readme.md) is source evidence; its client-specific configuration does not establish native acceptance. No provider is authenticated or live-tested by this port.
