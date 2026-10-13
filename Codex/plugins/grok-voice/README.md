# Grok Voice for Codex

Community adaptation of `grok-voice` at upstream version `0.1.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Add Grok voice to an app: realtime speech-to-speech, speech-to-text dictation, text-to-speech read-aloud, and a log-driven fix loop for voice sessions.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$add-dictation`, `$add-read-aloud`, `$add-voice`, `$debug-voice`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add grok-voice@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$grok-voice:add-dictation`. Full names avoid collisions with skills from other plugins.
