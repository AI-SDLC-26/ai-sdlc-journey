#!/usr/bin/env bash
# preToolUse hook (Copilot): blocks tool calls that touch paths in policy/protected-paths.txt.
#
# Input (stdin): the hook JSON that Copilot sends.
# Output: ONE JSON decision when the call is blocked.
# Exit:  non-zero also denies (fail closed). A timeout does not.

command -v jq >/dev/null || {
  echo "jq not installed" >&2
  exit 1
}

# Windows sends C:\repo\file but Git Bash sees /c/repo/file: rewrite it anywhere in the text.
normalise_paths() {
  sed -E \
    -e 's#\\#/#g' \
    -e 's#(^|[^A-Za-z])([A-Za-z]):/#\1/\L\2/#g'
}

# toolArgs is an object for some tools and a JSON string for others, so collect every string
# in the payload except cwd, timestamp and toolName.
all_strings_filter='[del(.cwd, .timestamp, .toolName) | .. | strings] | join(" ")'
text=$(jq -r "$all_strings_filter" | normalise_paths) || exit 1

# Absolute paths become repo-relative (the hook runs from the repo root).
repo_root=$(printf '%s' "$PWD" | normalise_paths)
text="${text//"$repo_root/"/}"

if ./scripts/is-protected.sh "$text"; then
  block_reason="Blocked by policy/protected-paths.txt. Ask a human (see docs/adr/0001)."
  jq -cn --arg reason "$block_reason" \
    '{permissionDecision:"deny", permissionDecisionReason:$reason}'
fi

exit 0
