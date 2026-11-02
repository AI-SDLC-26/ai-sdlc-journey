#!/usr/bin/env bash
# Tells whether a path, or a piece of command text, is covered by the protection policy.
#
# Usage:   is-protected.sh "<path or command text>"
# Exit:    0 = protected (also when the policy file is missing: fail closed)
#          1 = not protected
# Policy:  policy/protected-paths.txt holds one extended regex per line.
#          Blank lines and lines starting with # are ignored.
#          Matching is case-insensitive.

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
policy_file="$repo_root/policy/protected-paths.txt"
text_to_check="$1"
comment_or_blank_line='^[[:space:]]*(#|$)'

if [ ! -r "$policy_file" ]; then
  echo "policy file missing: $policy_file" >&2
  exit 0   # fail closed
fi

while read -r protected_pattern; do
  if printf '%s' "$text_to_check" | grep -qiE "$protected_pattern"; then
    exit 0
  fi
done < <(grep -vE "$comment_or_blank_line" "$policy_file")

exit 1
