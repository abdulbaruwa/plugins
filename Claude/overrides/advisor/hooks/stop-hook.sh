#!/bin/bash

# Stop hook for Advisor.
# If files changed since the last advisor consult and the turn ended without one,
# ask Claude (once per batch of edits) to run the pre-completion consult.
#
# Input:  { "stop_hook_active": bool, "last_assistant_message": "...", ...common }
# Output: { "decision": "block", "reason": "<text>" } to continue, or exit 0 with no output

set -Eeuo pipefail
trap 'exit 0' ERR

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

HOOK_INPUT=$(cat)

advisor_require_enabled
advisor_bind_session "$HOOK_INPUT" || exit 0

# Claude is already continuing because a Stop hook (this one or another plugin's)
# asked it to. Never nudge twice in a row. If a consult ran after our last nudge,
# edits made while acting on its verdict are covered by that consult.
if [[ "$(jq -r '.stop_hook_active // false' <<< "$HOOK_INPUT")" == "true" ]]; then
  NUDGED=$(jq -r '.nudged_at // ""' "$STATE_FILE")
  LAST=$(jq -r '.last_consult_at // ""' "$STATE_FILE")
  if [[ -n "$NUDGED" && -n "$LAST" && ! "$LAST" < "$NUDGED" ]]; then
    rm -f "$PENDING_FILE"
  fi
  exit 0
fi

NUDGE=$(jq -r 'if .nudge == false then "false" else "true" end' "$STATE_FILE")
[[ "$NUDGE" == "true" ]] || exit 0
[[ -f "$PENDING_FILE" ]] || exit 0

# Claude stopped to ask the user something: the last non-empty line has a question
# mark with no sentence end after it ("Ship it? (y/n)", "**Proceed?**", "要继续吗？").
# Stay quiet and leave the marker armed so the reminder fires after the user answers.
ASKED=$(jq -r '(.last_assistant_message // "") | [splits("\n") | select(test("\\S"))] | (last // "") | test("[?？][^.!。]*$")' <<< "$HOOK_INPUT")
[[ "$ASKED" == "true" ]] && exit 0

rm -f "$PENDING_FILE"
advisor_state_update '.nudged_at = $now' --arg now "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

MODEL=$(jq -r '.model // "opus"' "$STATE_FILE")
MESSAGE="[Advisor] Files changed since the last advisor consult and the turn ended without one. If this work is done, or you were about to declare it done, run the pre-completion consult now per the advisor skill: build the briefing, spawn the \`advisor:advisor-subagent\` agent (model: $MODEL), act on the verdict, and report it in one line. If the change was trivial, or you are waiting on the user, say so in one line and stop."

jq -n --arg msg "$MESSAGE" '{"decision": "block", "reason": $msg}'
exit 0
