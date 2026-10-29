# Vanta for Codex

Community adaptation of `third_party/vanta` at upstream version `1.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Query and remediate compliance tests, controls, frameworks, risks, and vulnerabilities in Vanta.

## Scope and proof

Ask the user to select mcp.vanta.com (United States), mcp.eu.vanta.com (Europe), or mcp.aus.vanta.com (Australia). Do not infer a region. Verify native authentication and tool permissions before configuring that exact host.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add vanta@cursor-plugins-codex
```

Run `$setup-vanta` to complete supported configuration before connecting.
