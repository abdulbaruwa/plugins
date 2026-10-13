---
name: cancel-ralph
description: "Cancel the Ralph loop in this conversation and mark its task state cancelled."
---

# Cancel Ralph

Stop the active loop in this chat. If its task-owned .codex/ralph/state.json exists, read it and change status to cancelled, preserving the task and last evidence. If no loop exists, say so. Report the iteration reached. A separately configured Codex goal or automation must also be stopped through its native tool when the user's cancellation covers it. Preserve unrelated files and other chats' loops.
