#!/usr/bin/env bash
# Expiry signal for agent context: fails when instructions point at paths that no longer exist.
#
# Reads the agent context files and checks that every src/, docs/, scripts/, policy/ and spa/
# path they mention still exists in the repository.
# Exit: 0 = context is fresh, 1 = a referenced path is missing (or there are no context files).
set -euo pipefail
cd "$(dirname "$0")/.."

candidate_files=(
  AGENTS.md
  README.md
  DEMO.md
  .github/instructions/*.md
)
referenced_path_regex='(src|docs|scripts|policy|web)/[A-Za-z0-9._/-]*'

# Keep only the context files that actually exist.
context_files=()
for candidate in "${candidate_files[@]}"; do
  if [ -f "$candidate" ]; then
    context_files+=("$candidate")
  fi
done

if [ ${#context_files[@]} -eq 0 ]; then
  echo "no agent context files found"
  exit 1
fi

# Check referenced paths and report the context file and line for each missing reference.
stale_found=0
for context_file in "${context_files[@]}"; do
  while IFS=: read -r line referenced_path; do
    if [ ! -e "$referenced_path" ]; then
      echo "::error file=$context_file,line=$line::STALE context: '$referenced_path' is referenced but does not exist"
      stale_found=1
    fi
  done < <(
    grep -onhE "$referenced_path_regex" "$context_file" \
      | sed -E 's#([.,])$##'
  )
done

if [ $stale_found -eq 0 ]; then
  echo "context OK: ${context_files[*]}"
fi
exit $stale_found
