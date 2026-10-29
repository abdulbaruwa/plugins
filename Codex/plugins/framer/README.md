# Framer for Codex

Community adaptation of `third_party/framer` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Design, build, and edit your Framer sites, pages, and CMS content.

## Scope and proof

Framer accepts localhost or HTTPS OAuth redirects, while native client callback compatibility is unverified. Verify the exact redirect and supported registration before connecting; never substitute Cursor hosted placement. Publishing a site requires explicit user authority.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add framer@cursor-plugins-codex
```

Run `$setup-framer` to complete supported configuration before connecting.
