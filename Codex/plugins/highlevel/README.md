# HighLevel for Codex

Community adaptation of `third_party/highlevel` at upstream version `1.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Work with contacts, conversations, opportunities, calendars, and payments.

## Scope and proof

Upstream uses HighLevel’s client-specific Cursor endpoint. Confirm a provider-supported Codex endpoint and client registration before configuration; no connection is enabled.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add highlevel@cursor-plugins-codex
```

Run `$setup-highlevel` to check native endpoint and OAuth registration requirements before connecting.
