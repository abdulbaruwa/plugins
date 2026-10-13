---
name: create-plugin-scaffold
description: "Create a portable Codex plugin with skills, supported MCP configuration, and local marketplace wiring when starting a plugin."
---

# Create a Codex plugin

Honor the user's target directory and plugin purpose. Use current official OpenAI plugin documentation. Create root plugin.json using the Agent Plugins schema, a stable kebab-case name, version, description, original author, and license. Put repeatable workflows in skills/<name>/SKILL.md with name and description frontmatter. Convert reusable role procedures into skills or referenced prompt resources. Rules do not become automatic policy merely by being copied.

Discover portable skills from skills/ and MCP servers from root mcp.json. Use an explicit transport type: stdio, streamable-http, or sse. Put OpenAI presentation metadata under extensions.com.openai. Keep package paths inside the plugin. Remote URLs and headers are literal; store credentials in native client configuration, never in package metadata.

If marketplace wiring is requested, add the plugin to .agents/plugins/marketplace.json at the marketplace root. Use source.source local and a ./-prefixed source.path, category, policy.installation AVAILABLE, and policy.authentication ON_INSTALL. Preserve existing entries. Validate manifests, skill metadata, relative references, and resource paths. Report created paths and the registration/install steps; creation alone does not install a plugin.
