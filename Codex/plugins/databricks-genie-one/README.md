# Databricks Genie One for Codex

Community adaptation of `third_party/databricks-genie-one` at upstream version `1.0.1`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Ask Databricks Genie questions about your workspace's data in plain language.

## Scope and proof

Supply a bare workspace hostname and your own Databricks OAuth client ID. Dynamic registration is unsupported; a client secret is optional, and ai-gateway/offline_access scopes are required. Verify native redirect support before connecting.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add databricks-genie-one@cursor-plugins-codex
```

Run `$setup-databricks-genie-one` to complete supported configuration before connecting.
