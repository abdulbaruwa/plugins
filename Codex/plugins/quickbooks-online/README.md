# QuickBooks Online for Codex

Community adaptation of `third_party/quickbooks-online` at upstream version `1.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Read invoices, bills, expenses, customers, accounts, and financial reports.

## Scope and proof

Intuit now publishes an MCP endpoint, but upstream relies on Cursor-owned OAuth credentials. Verify a provider-supported Codex OAuth client before setup; no connection is enabled.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add quickbooks-online@cursor-plugins-codex
```

Run `$setup-quickbooks-online` to check native endpoint and OAuth registration requirements before connecting.
