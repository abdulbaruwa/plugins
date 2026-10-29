# Feishu for Codex

Community adaptation of `third_party/feishu` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Search, create, and update Feishu docs, and read Feishu messages and groups.

## Scope and proof

Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified.

Package validation establishes structure only. Authentication, tool availability, and live provider behavior require separate acceptance checks.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add feishu@cursor-plugins-codex
```
