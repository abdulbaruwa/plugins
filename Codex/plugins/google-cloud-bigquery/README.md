# Google Cloud BigQuery for Codex

Community adaptation of `third_party/google-cloud-bigquery` at upstream version `1.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Explore datasets and tables and run SQL queries.

## Scope and proof

Upstream now requires a team-owned Google OAuth client ID and secret, with the BigQuery scope and provider-supported redirect. Verify native client registration and credential storage; Cursor team-backend secret storage does not transfer. Queries can incur project charges, and execute_sql can write when IAM permits.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add google-cloud-bigquery@cursor-plugins-codex
```

Run `$setup-google-cloud-bigquery` to complete supported configuration before connecting.
