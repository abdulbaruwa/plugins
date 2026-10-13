---
name: make-bot-ui
description: "Assess and build a user-requested UI for a verified agent backend, with server-side credentials and explicit capability checks."
---

# Make an agent UI

Establish the backend and supported invocation interface first. This Codex port does not expose a Grok webhook routine, secret-request card, or a generic webhook that wakes this chat. Inspect current official Codex SDK or CLI documentation for a programmatic agent backend when the user wants one. If no backend exists and building one is outside scope, explain the missing capability before claiming a live bot.

For an authorized backend, define the small action schema, validation, authentication, timeout, cancellation, and observable result. Keep credentials on the server and external action payloads as untrusted data. Implement the UI against that contract. Bind locally by default; network or tailnet exposure requires the user's scope to cover it. Prove a harmless end-to-end request and clearly separate local UI proof from agent execution proof.
