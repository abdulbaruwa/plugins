# Stable for Codex

Community adaptation of `third_party/stable` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Find mail, read scanned documents, and call Stable API endpoints.

## Scope and proof

Configure x-api-key from the STABLE_API_KEY environment variable using the supported native secret/header mapping. No credential interpolation is copied into a portable connection. The execute-request tool may write; honor the requested action and authorization.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add stable@cursor-plugins-codex
```

Run `$setup-stable` to complete supported configuration before connecting.
