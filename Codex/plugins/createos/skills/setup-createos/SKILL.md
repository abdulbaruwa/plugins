---
name: setup-createos
description: "Qualify and set up CreateOS for Codex using native supported authentication."
---

# Set up CreateOS

Use the documented X-Api-Key path with a CreateOS account and a key held in the native credential store or environment. Do not infer native OAuth compatibility from advertised DCR. Actions run as the key owner and consume account quotas; inspect GetQuotas. Obtain explicit authority for deployments, environment changes, deletion, sandbox command execution, template purchases, credential management and project transfers. A transfer bearer token lasts six hours and conveys ownership; never expose it. Accepted deployment requests are not completed deployments: poll deployment state and logs.

Read ../../references/upstream-readme.md and ../../references/upstream-mcp.json as evidence. Preserve unrelated client settings, never print secrets, and stop if native identity, redirect or authentication support is missing. A config example is not an active connection. With user authority, test a scoped read before claiming any tool works.
