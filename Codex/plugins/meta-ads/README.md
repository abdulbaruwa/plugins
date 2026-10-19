# Meta Ads for Codex

Community adaptation of `third_party/meta-ads` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Manage campaigns, ads, audiences, and catalogs, and pull performance insights.

## Scope and proof

Upstream supplies Cursor’s registered Meta OAuth app ID and no dynamic client registration. Register a provider-supported Codex client; no shared app ID or connection is enabled.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add meta-ads@cursor-plugins-codex
```

Run `$setup-meta-ads` to check native endpoint and OAuth registration requirements before connecting.
