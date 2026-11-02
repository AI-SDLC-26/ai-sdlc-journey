---
description: Weekly check that agent context (AGENTS.md, instructions, ADRs) still matches the code.
on:
  schedule: weekly
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  copilot-requests: write
engine: copilot
safe-outputs:
  create-issue:
    title-prefix: "[context drift] "
    labels: [ai-context]
    close-older-issues: true
---

# Context gardener

Compare what the agent context says with what the repository does.

Read `AGENTS.md`, `.github/copilot-instructions.md`, every file in `.github/instructions/` and every ADR in `docs/adr/`.
For each concrete statement (commands, paths, conventions, decisions), check the code and CI configuration.

If everything matches, do nothing.
Otherwise create one issue with a table: statement, file, what the code does instead, suggested fix to the context (not to the code).
The owner named in each file's header decides; you only report.
