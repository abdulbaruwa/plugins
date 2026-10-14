# Requirements

dyl-stack layers on other plugins. Check the ones your skill needs before any work. If one is missing, stop, name it, and tell the user to run `/plugin install <name>@cursor-plugins-claude`. Do not improvise the missing piece.

| Plugin | Installed when | Reach its files |
|---|---|---|
| `pstack` | `setup-pstack` is in your skill list | Most pstack skills are slash-only and hidden from the list. pstack's session-start note names its root: `<pstack root>/skills/poteto-mode/SKILL.md`, `<pstack root>/skills/poteto-mode/playbooks/<name>.md`, `<pstack root>/skills/principle-<name>/SKILL.md`, `<pstack root>/skills/bro/SKILL.md`, `<pstack root>/skills/unslop/SKILL.md`. |
| `cursor-team-kit` | `control-ui`, `verify-this`, and `deslop` are in your skill list | Load them with the Skill tool (`cursor-team-kit:<name>`). |
| `thermos` | `thermos:thermo-nuclear-review-subagent` and `thermos:thermo-nuclear-code-quality-review-subagent` are available Agent subagent types | Launch them by subagent type. |
| `figma` (from `claude-plugins-official`) | a Figma design-to-code skill is in your skill list and a Figma MCP tool call succeeds | Load it with the Skill tool. |
