---
name: setup-jobber
description: "Qualify and configure Jobber through native own-client OAuth without enabling an unverified connection."
---

# Set up Jobber

Jobber requires an own registered OAuth app with client ID and secret; DCR is unsupported. Verify the actual native callback instead of copying Cursor callbacks. Core, Connect, Grow and Plus plans apply; each user signs in with their own permissions through supported user-mediated OAuth, never a browser agent. Clients, properties and requests can be created/edited. Quotes are CREATE-ONLY with total, deposit and discount, no unit costs or margins, and cannot be edited afterward. Jobs, invoices and schedule are read-only; no record deletion/archive. Preview and authorize exact customer-record changes. Preserve the nine advertised client/request/quote/job/invoice/visit read/write scopes; request only those needed.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as provenance evidence. Preserve unrelated settings. Keep the client secret in supported native credential storage and never print it. Verify registered scopes and supported client/redirect before using the endpoint example. Missing prerequisites mean setup remains incomplete. Only an authorized scoped read is a setup smoke test; never create a quote or customer record to claim connection acceptance.
