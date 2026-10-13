# Shopify for Codex

Community adaptation of `third_party/shopify-store` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Connect your Shopify store so Grok can answer questions about your products, orders, customers, inventory, and sales. You sign in with Shopify and approve the store access Grok requests; Grok keeps that authorization so the connector can work, and Grok Bot's privacy mode still controls whether your conversations are stored or used for training. xAI never sees or stores your Shopify password, and you can disconnect the store anytime from grok.com.

Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified.



Additional consulted-rule skill: `$shopify-guidance`.

## Scope and proof

Provider endpoint and portable MCP transport packaged; authentication and live behavior are unverified.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add shopify-store@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$shopify-store:shopify-guidance`. Full names avoid collisions with skills from other plugins.
