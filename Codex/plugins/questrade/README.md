# Questrade for Codex

Community adaptation of `third_party/questrade` at upstream version `1.0.0`. Original authors, assets and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Read your Questrade portfolio, get live market data, and discuss potential trades.

## Scope and proof

Packages Questrade's own endpoint for account, balance, position and market-data tools. Trading is described as discussion; do not infer order execution. Authentication, account entitlements, tool schemas and live behavior are unverified.

Static packaging does not establish installation, authentication, account entitlements or live tool behavior.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add questrade@cursor-plugins-codex
```
