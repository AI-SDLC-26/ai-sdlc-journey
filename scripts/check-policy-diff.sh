#!/usr/bin/env bash
# CI gate: AI-assisted pull requests may not change protected paths.
# Humans may, with CODEOWNERS review.
#
# Environment:
#   BASE_REF         branch to diff against (default: origin/main)
#   PR_LABELS        comma-separated PR labels; "ai-assisted" marks the PR as AI-assisted
#   PR_AUTHOR        PR author login; a match with AI_AUTHOR_REGEX also marks it AI-assisted
#   AI_AUTHOR_REGEX  logins that count as AI authors (adjust to the logins you see)
# Exit: 0 = passed (humans only get a warning), 1 = AI-assisted change to a protected path
set -euo pipefail
cd "$(dirname "$0")/.."

base_ref="${BASE_REF:-origin/main}"
default_ai_author_regex='^(Copilot|copilot-swe-agent.*|claude.*)$'
ai_author_regex="${AI_AUTHOR_REGEX:-$default_ai_author_regex}"

# Decide whether the PR counts as AI-assisted: by label, or by author login.
is_ai_assisted=false
if [[ ",${PR_LABELS:-}," == *",ai-assisted,"* ]]; then
  is_ai_assisted=true
fi
if [[ -n "${PR_AUTHOR:-}" && "$PR_AUTHOR" =~ $ai_author_regex ]]; then
  is_ai_assisted=true
fi

# Collect the changed files that match the protection policy.
protected_changes=()
while read -r changed_file; do
  if [ -n "$changed_file" ] && ./scripts/is-protected.sh "$changed_file"; then
    protected_changes+=("$changed_file")
  fi
done < <(git diff --name-only "$base_ref"...HEAD)

for protected_file in "${protected_changes[@]}"; do
  echo "::warning file=$protected_file::protected path changed"
done

if [ ${#protected_changes[@]} -gt 0 ] && $is_ai_assisted; then
  echo "::error::AI-assisted change touches protected paths: ${protected_changes[*]}"
  exit 1
fi

changed_count=${#protected_changes[@]}
echo "policy check passed (ai_assisted=$is_ai_assisted, protected files changed=$changed_count)"
