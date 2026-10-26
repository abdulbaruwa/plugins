# Jobber for Codex

Community adaptation of `third_party/jobber` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Work with clients, requests, quotes, jobs, visits, and invoices.

## Scope and proof

Register your own Jobber OAuth client ID and required secret with a native supported redirect. Only clients, requests, and quotes are writable in the documented integration; jobs, invoices, and visits are read-only.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add jobber@cursor-plugins-codex
```

Run `$setup-jobber` to complete supported configuration before connecting.
