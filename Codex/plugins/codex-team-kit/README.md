# Codex Team Kit for Codex

Community adaptation of `cursor-team-kit` at upstream version `1.2.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Codex engineering workflows for CI, review, delivery, local control, and verification.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$check-compiler-errors`, `$control-cli`, `$control-ui`, `$deslop`, `$fix-ci`, `$fix-merge-conflicts`, `$get-pr-comments`, `$loop-on-ci`, `$make-pr-easy-to-review`, `$new-branch-and-pr`, `$pr-review-canvas`, `$review-and-ship`, `$run-smoke-tests`, `$thermo-nuclear-code-quality-review`, `$verify-this`, `$weekly-review`, `$what-did-i-get-done`, `$workflow-from-chats`.



Additional consulted-rule skill: `$typescript-guidance`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add codex-team-kit@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$codex-team-kit:check-compiler-errors`. Full names avoid collisions with skills from other plugins.
