---
name: review-plugin-submission
description: Audit a Claude Code plugin for marketplace readiness. Use when validating manifests, component metadata, discovery paths, and submission quality before publishing.
---

# Review plugin submission

## Trigger

A plugin is implemented and needs a final quality check before submission or release.

## Workflow

1. Run `claude plugin validate <plugin-dir> --strict` and, for marketplace repos, `claude plugin validate <marketplace-root>`. Treat its errors as blocking and report its warnings.
2. Verify manifest validity:
   - `.claude-plugin/plugin.json` exists
   - `name` is valid lowercase kebab-case
   - metadata fields are coherent (`description`, `version`, `author`, `license`)
   - every `userConfig` option has `type`, `title`, and `description`, and tokens are `sensitive`
3. Verify component discoverability:
   - Skills in `skills/*/SKILL.md`
   - Agents in `agents/` markdown files
   - Commands in `commands/` markdown files
   - Hooks in `hooks/hooks.json`
   - MCP config in `.mcp.json` (or a `mcpServers` entry in the manifest)
   - No `CLAUDE.md` at the plugin root (Claude Code does not load it)
4. Verify component metadata:
   - Skills include `name` and `description` frontmatter
   - Agents and commands include `name` and `description`
   - Hook commands reference scripts through `${CLAUDE_PLUGIN_ROOT}` and the scripts are executable
5. Verify repository integration:
   - For marketplace repos, the plugin entry exists in `.claude-plugin/marketplace.json`
   - `source` resolves to the plugin directory, starts with `./`, and names are unique
6. Verify documentation quality:
   - `README.md` states purpose, installation (`/plugin install <name>@<marketplace>`), and component coverage
   - the optional `icon` path is valid and repository-hosted

## Checklist

- `claude plugin validate` passes
- Manifest exists and parses as valid JSON
- All declared paths exist and are relative
- No broken file references
- No missing frontmatter on skills, agents, or commands
- Plugin scope is clear and focused
- Marketplace registration complete (if multi-plugin repo)

## Output

- Pass/fail report by section
- Prioritized fix list
- Final submission recommendation
