---
name: codex-sdk
description: "Build server-side tools and CI workflows with the Codex SDK when the user requests programmatic Codex integration."
---

# Codex SDK

Read the current official SDK documentation at https://learn.chatgpt.com/docs/codex-sdk before implementing. Use @openai/codex-sdk for TypeScript and the documented Python SDK when Python is requested. Inspect the installed SDK types before using options for working directory, sandbox, approvals, models, streaming, cancellation, or structured output.

The TypeScript client starts a local thread with codex.startThread(), runs a prompt with thread.run(), and resumes a known thread with codex.resumeThread(threadId). Inherit configured models by default. Select authentication and runtime permissions using current official guidance and the user's authorized scope; do not request or expose secrets in chat. Use a connector/key setup skill if new API credentials are actually required.

Keep the SDK server-side. Preserve the thread ID and validate returned state rather than claiming success from process startup. Handle failure and cancellation explicitly. Use the Codex app server for clients that need full authentication, approvals, history, or streamed agent events. Cursor SDK APIs and hosted cloud lifecycle are not drop-in equivalents. Test startup/configuration separately from actual task behavior and report what ran.
