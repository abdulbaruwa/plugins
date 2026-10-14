---
name: create-plugin-scaffold
description: Create a new Claude Code plugin scaffold with a valid manifest, component directories, and marketplace wiring. Use when starting a new plugin or adding a plugin to a multi-plugin repository.
---

# Create plugin scaffold

## Trigger

You need to create a new Claude Code plugin from scratch and make it ready for local use or marketplace submission.

## Required Inputs

- Plugin name (lowercase kebab-case)
- Plugin purpose and target users
- Component set to include (`skills`, `agents`, `hooks`, `mcpServers`, `commands`, `outputStyles`, `lspServers`)
- Repository style (`single-plugin` or `multi-plugin marketplace`)

## Output Location

By default, create the plugin in the user's skills directory:

```
~/.claude/skills/<plugin-name>/
```

A plugin there loads automatically in the next session as `<plugin-name>@skills-dir`, with no install step. `claude plugin init <plugin-name>` creates this layout. If the user asks for the plugin elsewhere (inside an existing repo or a specific directory), use that path, and tell them to try it with `claude --plugin-dir <path>`.

## Workflow

1. Validate the plugin name: lowercase kebab-case, starts and ends with an alphanumeric character.
2. Determine the target directory:
   - Default: run `claude plugin init <plugin-name> --description "<purpose>" --with <components>`, which scaffolds `~/.claude/skills/<plugin-name>/`. `--with` takes only `skills`, `agents`, `hooks`, `mcp`, `lsp`, `output-style`, and `channel`; add `commands/` by hand.
   - Override: create the path the user specifies, and its parents, by hand.
3. Make sure these base files exist in the target directory:
   - `.claude-plugin/plugin.json`
   - `README.md`
   - `LICENSE`
   - optional `CHANGELOG.md`
4. Populate `plugin.json`:
   - Required: `name`
   - Recommended: `version`, `description`, `author` (`name`, optional `email`, `url`), `license`, `keywords`
   - Prompt for secrets and settings with `userConfig` (each option needs `type`, `title`, `description`; mark tokens `"sensitive": true`) and reference them as `${user_config.KEY}`.
   - Add component paths only when the default locations do not fit. Paths start with `./` and stay inside the plugin.
5. Create component files with valid frontmatter:
   - Skills: `skills/<skill-name>/SKILL.md` with `name` and `description`. Add `disable-model-invocation: true` for workflows only the user should start, `paths` to scope a skill to matching files, and `argument-hint` when it takes `$ARGUMENTS`.
   - Agents: `agents/*.md` with `name` and `description`, plus optional `tools`, `disallowedTools`, `model` (`sonnet`, `opus`, `haiku`, `fable`, `inherit`), and `effort`.
   - Hooks: `hooks/hooks.json` as `{"hooks": {"<Event>": [{"matcher": "...", "hooks": [{"type": "command", "command": "..."}]}]}}`. Reference scripts as `"${CLAUDE_PLUGIN_ROOT}/hooks/<script>"`.
   - MCP servers: `.mcp.json` with `{"mcpServers": {...}}`; remote servers use `"type": "http"`.
   - Always-on guidance: plugins have no rules directory. Put guidance in a skill (scoped with `paths` when it applies to certain files), or print it from a `SessionStart` hook.
6. If the repository has a `.claude-plugin/marketplace.json`, add a plugin entry:
   - `name`
   - `source` (relative to the folder that holds `.claude-plugin/`, starting with `./`)
   - optional metadata (`description`, `version`, `category`, `tags`, `keywords`)
7. Run `claude plugin validate <plugin-dir>` (and on the marketplace root, if there is one). Fix every error; fix warnings unless the user says otherwise.

## Guardrails

- Keep the plugin focused on one use case.
- Prefer concise, actionable skill text over long prose.
- Do not reference files that do not exist.
- Use default component locations unless custom paths are required.
- Default to `~/.claude/skills/<plugin-name>/` unless the user provides a different path.

## Output

- Created file tree for the plugin (with full path to the output directory)
- Final `plugin.json`
- Marketplace entry (if applicable)
- The `claude plugin validate` result
- How to load it: next session (skills directory), `claude --plugin-dir <path>`, or `/plugin install <name>@<marketplace>`
