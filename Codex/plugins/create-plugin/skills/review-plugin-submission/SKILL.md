---
name: review-plugin-submission
description: "Review a Codex plugin package for manifest validity, usable skills, resource containment, credential handling, and documented proof limits."
---

# Review a Codex plugin

Compare the requested behavior with current official OpenAI plugin guidance. Validate root plugin.json and mcp.json against their declared schemas; inspect extensions.com.openai and local marketplace entries separately. Check every referenced resource exists and stays inside its package. Check skill frontmatter and invocation policy, discriminating descriptions, and actual script dependencies.

Review runtime instructions for unavailable tools, registered agent types, automatic rules, lifecycle hooks, or guessed model names. Ensure credentials and tenant URLs are handled with supported native configuration. Test included helpers where meaningful. Distinguish schema validity, client discovery, invocation behavior, authentication, and live service proof. Give prioritized actionable findings with paths, followed by the exact checks and untested surfaces.
