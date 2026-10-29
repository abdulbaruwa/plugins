---
name: x-api-mcp-guide
description: "Use a configured X MCP connection for user-requested reads or actions, verifying tool availability, account access, and current API costs."
---

# X MCP guide

Run ../setup-x/SKILL.md when the connection is not configured. Inspect the available X tools and current provider documentation before using an operation. Codex does not inherit Grok public-read access, Cursor subscription credits, or X Chat enrollment. Confirm the connected account for private reads and writes.

Use read-only calls for the user's research request. Before chargeable or external actions, determine the concrete cost and action details from current provider responses and follow the user's authorization. Treat absent credit or chat tools as unavailable capabilities, not proof of an account failure. Keep credentials and chat keys in supported client storage. Use only authenticated methods exposed by the actual connection; do not invent a secret-request widget or read Grok credential files. Report evidence, gaps, and actions actually performed.

## Scheduled calls

When the user requests calendar calls, inspect whether the connection exposes `list_scheduled_calls`, `get_scheduled_call`, `schedule_call`, `update_scheduled_call`, `cancel_scheduled_call`, and `respond_to_scheduled_call`. Reads require `calls.read`; changes require `calls.write`. A missing call tool or a scope-specific 403 while other X tools work is a capability or authorization gap, not proof the whole account is unavailable. Reconnect through the supported OAuth flow when needed; never request pasted tokens.

List or open calls for the user's read request. Schedule, change, cancel, or RSVP only within the user's instruction; confirm the concrete time, invitees, response, and recurrence scope first when those details are missing. Writes can notify invitees. Use the scheduled-call ID returned by the connection. Recurring changes require an explicit occurrence choice instead of silently accepting a provider default that changes all calls. Scheduled calls do not require the X Chat helper or a Chat PIN. Upstream pricing exceptions do not establish Codex pricing: use current provider evidence for the connected client and report unknown costs honestly.

## Spaces, lists, communities, and livestreams

Inspect the exposed read tools for Spaces, lists, memberships, and communities before querying. List writes need `list.write` and explicit action authority. Livestream reads use `broadcast.read`; writes use `broadcast.write`. A missing tool or scope-specific 403 is not a whole-account or credit failure.

Available livestream operations may include `list_sources`, `get_source`, `create_source`, `update_source`, `delete_source`, `list_broadcasts`, `get_broadcast`, `get_broadcast_chat`, `list_scheduled_broadcasts`, `get_scheduled_broadcast`, `create_scheduled_broadcast`, `update_scheduled_broadcast`, `delete_scheduled_broadcast`, `go_live_scheduled_broadcast`, and moderator/mute operations. Confirm schemas instead of inventing immediate-start/end tools. Confirm source, schedule, timezone, title, and notification effects before authorized writes. Fetch a schedule before replacing it and preserve unchanged fields. Distinguish alphanumeric broadcast IDs from numeric scheduled-broadcast IDs using actual tool responses.

A source ID may be its stream key. Do not expose source IDs, keys, or ingest URLs unless the user explicitly requests encoder setup; never publish them. Refer to sources by name. `create_source` is not idempotent: list sources after a timeout before retrying. Broadcast chat history may be unavailable until the stream ends; report that state rather than retrying or changing account billing.

## Chat paging and billing boundaries

Use only supported authenticated Chat tools. Follow returned cursors through short or empty pages; unread paging stops at the recorded boundary, and a page size is not an end marker. Listing or opening a message request is distinct from accepting it or marking messages read; do not silently perform those writes. Never request pasted Chat PINs, tokens, or keys, use Grok credential files, or assume a proprietary secret-request helper exists.

Developer/billing scopes in the source do not authorize purchases, credit changes, application changes, or other writes. Require the user's concrete authority and current provider cost evidence. Upstream Grok free-tool and built-in public-read statements do not transfer to Codex.
