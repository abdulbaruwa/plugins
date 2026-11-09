# RingCentral Phone for Codex

Community adaptation of `third_party/ringcentral-phone` at upstream version `1.1.0`. Original authors, assets and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Read call activity, AI call notes, SMS, voicemail, and fax, and send SMS.

## Scope and proof

Packages the separate RingCentral phone endpoint for calls, AI notes, SMS, voicemail and fax. Sending SMS requires the user's explicit instruction. Authentication, tool availability and live behavior are unverified.

Static packaging does not establish installation, authentication, account entitlements or live tool behavior.

## Installation

Register the standalone marketplace with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add ringcentral-phone@cursor-plugins-codex
```
