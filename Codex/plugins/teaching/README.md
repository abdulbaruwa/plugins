# Teaching for Codex

Community adaptation of `teaching` at upstream version `1.0.0`. Original authors and MIT license are preserved. This is not an official Cursor or OpenAI distribution.

Skill mapping, practice plans, and learning retrospectives. Builds personalized roadmaps with milestones and practice checkpoints, and runs periodic reviews to adjust based on progress.

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Packaged skills: `$create-learning-path`, `$run-learning-retrospective`.

## Scope and proof

Codex skill adaptation; Cursor hooks and automatic rules are not installed.

Package validation and client discovery establish structure and readable components. Installation, end-to-end skill decisions, SDK execution, authentication, and live provider operations need separate acceptance checks.

## Installation

Register the standalone marketplace from a clone of this repository with `codex plugin marketplace add <repository-path>/Codex`, then install this package:

```sh
codex plugin add teaching@cursor-plugins-codex
```

Use the installed skill catalog to invoke a packaged skill, such as `$teaching:create-learning-path`. Full names avoid collisions with skills from other plugins.
