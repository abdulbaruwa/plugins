#!/bin/bash

# SubagentStop hook for Advisor (matcher: the `advisor:advisor-subagent` agent).
# Counts the consult, clears the pending-edits marker, and appends the advice
# to .claude/advisor/log.md so the user can review it later. A consult that
# returned nothing is not counted, so the end-of-turn nudge stays armed.
#
# Input:  { "agent_type": "advisor:advisor-subagent", "agent_id": "...",
#           "agent_transcript_path": "<jsonl>", ...common }
# Output: none

set -Eeuo pipefail
trap 'exit 0' ERR

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

HOOK_INPUT=$(cat)

advisor_require_enabled
advisor_bind_session "$HOOK_INPUT" || exit 0

AGENT_TYPE=$(jq -r '.agent_type // empty' <<< "$HOOK_INPUT")
[[ "$AGENT_TYPE" == *advisor-subagent ]] || exit 0

# The advisor's reply: the hook input's last message when the host provides it,
# else the last text block of the transcript (or the message of a final
# SubagentHandback call). Lines that do not parse, such as a half-written last
# line, are skipped; the slice counts characters, so UTF-8 is never split.
SUMMARY=$(jq -r '.last_assistant_message // empty | .[0:6000]' <<< "$HOOK_INPUT")
TRANSCRIPT=$(jq -r '.agent_transcript_path // empty' <<< "$HOOK_INPUT")
if [[ -z "$SUMMARY" && -n "$TRANSCRIPT" && -f "$TRANSCRIPT" ]]; then
  SUMMARY=$(jq -Rnr '[inputs | fromjson? | select(type == "object" and .type == "assistant") | .message.content[]?
      | (if .type == "text" then .text
         elif (.type == "tool_use" and .name == "SubagentHandback") then .input.message
         else empty end) | strings] | (last // "") | .[0:6000]' "$TRANSCRIPT" 2>/dev/null || true)
fi
[[ -n "$SUMMARY" ]] || exit 0

DESCRIPTION="Advisor consult"
META="${TRANSCRIPT%.jsonl}.meta.json"
if [[ -n "$TRANSCRIPT" && -f "$META" ]]; then
  DESCRIPTION=$(jq -r '(.description // "Advisor consult") | gsub("[\\r\\n]+"; " ")' "$META" 2>/dev/null || echo "Advisor consult")
fi

NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
advisor_state_update '.consults = ((.consults // 0) + 1) | .last_consult_at = $now' --arg now "$NOW"
rm -f "$PENDING_FILE"

printf '## %s — %s\n\n%s\n\n' "$NOW" "$DESCRIPTION" "$SUMMARY" >> "$LOG_FILE"
exit 0
