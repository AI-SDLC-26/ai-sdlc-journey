# ADR 0001: AI delegation policy
Status: accepted · Owner: platform + security · Review: every quarter or after an incident

## Decision
Agents may read the repository and propose changes as draft pull requests.
They may not touch paths in policy/protected-paths.txt, push to main, approve, merge or deploy.

## Enforcement (not the prompt)
- Hooks: .github/hooks/protect-paths.ps1
- CI: scripts/check-policy-diff.sh, scripts/check-context.sh
- Review: CODEOWNERS + ruleset "require review from code owners"

## Consequences
We lose autonomous fixes in protected areas. We gain a perimeter we can audit.
