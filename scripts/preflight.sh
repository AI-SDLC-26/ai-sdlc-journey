#!/usr/bin/env bash
# Checks the tools the demos need. Run it from Git Bash or WSL.
#
# Exit: 0 = everything required is present, 1 = a hard requirement is missing.

missing_required=0

# Required tool: prints "ok", or a MISSING line and fails the whole check.
require_tool() {   # <command> <hint>
  local command_name=$1 hint=$2
  if command -v "$command_name" >/dev/null; then
    printf 'ok       %s\n' "$command_name"
  else
    printf 'MISSING  %s  (%s)\n' "$command_name" "$hint"
    missing_required=1
  fi
}

# Optional tool: prints "ok" or an "optional" line; never fails the check.
want_tool() {   # <command> <hint>
  local command_name=$1 hint=$2
  if command -v "$command_name" >/dev/null; then
    printf 'ok       %s\n' "$command_name"
  else
    printf 'optional %s  (%s)\n' "$command_name" "$hint"
  fi
}

jq_hint="hooks fail closed without it; Windows: winget install jqlang.jq, then reopen the shell"

require_tool git "https://git-scm.com"
require_tool jq  "$jq_hint"
want_tool gh     "needed for compile and metrics demos"

# The gh-aw extension is only relevant when gh itself is installed.
if command -v gh >/dev/null; then
  if gh extension list 2>/dev/null | grep -q 'gh-aw'; then
    gh_aw_version=$(gh extension list | grep gh-aw | awk '{print $NF}')
    echo "ok       gh-aw: $gh_aw_version"
  else
    echo "optional gh-aw  (gh extension install github/gh-aw@<pinned tag>)"
  fi
fi

cd "$(dirname "$0")/.." || exit 1

# Policy and hook files need LF line endings: a CR would end up inside the regexes.
files_that_need_lf=(
  scripts/is-protected.sh
  policy/protected-paths.txt
  .claude/hooks/protect-paths.ps1
  .github/hooks/protect-paths.ps1
)
for file in "${files_that_need_lf[@]}"; do
  carriage_returns=$(tr -cd '\r' < "$file" | wc -c)
  if [ "$carriage_returns" -gt 0 ]; then
    echo "MISSING  LF line endings in $file (see .gitattributes, then re-checkout)"
    missing_required=1
  fi
done

exit $missing_required
