---
name: cancel-ralph
description: "Cancel the Ralph loop in this conversation and mark its task state cancelled."
---

# Cancel Ralph

Stop the active loop in this chat. Use the owner ID and run ID retained when this chat started it, and the helper at [../ralph-loop/state.py](../ralph-loop/state.py):

```sh
python3 "<ralph-loop-skill-directory>/state.py" --workspace "<checkout>" cancel --owner "<owner_id>" --run-id "<run_id>"
```

The helper rejects a different owner, preserves the task and last evidence, and leaves completed or already-cancelled runs intact. If this chat has no run capsule, say no owned run is identifiable; never choose the newest file, read an owner ID from disk to justify adoption, or change the legacy shared state file. A separately configured Codex goal or automation must also be stopped through its native tool when the user's cancellation covers it. Report the run ID and iteration reached, preserving unrelated files and other chats' loops.
