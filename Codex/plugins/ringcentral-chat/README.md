# RingCentral Chat for Codex

Community adaptation of `third_party/ringcentral-chat` at upstream version `1.0.0`. Original authors, assets and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Read team chats and posts, send messages, and manage teams, tasks, and notes.

## Scope and proof

Packages the separate RingCentral team-chat endpoint. It can send messages and manage teams, tasks and notes; outbound actions require the user's explicit instruction. Authentication, tool availability and live behavior are unverified.

Static packaging does not establish installation, authentication, account entitlements or live tool behavior.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add ringcentral-chat@cursor-plugins-codex
```
