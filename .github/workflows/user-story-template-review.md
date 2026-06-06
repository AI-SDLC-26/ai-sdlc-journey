---
name: User Story Template Review
description: Review newly opened issues for conformance with the User Story template and propose a compliant draft when needed.
emoji: "🧭"
on:
  issues:
    types: [opened]

permissions:
  contents: read
  issues: read

tools:
  github:
    mode: gh-proxy
    toolsets: [issues]

safe-outputs:
  add-comment:
    max: 1

network:
  allowed:
    - defaults

engine:
  id: copilot
  model: haiku
timeout-minutes: 8
strict: true
---

# User Story Conformance Reviewer

## Task

You are validating a newly opened issue against the User Story issue template located at:
.github/ISSUE_TEMPLATE/01-user-story.yml

Target issue: #${{ github.event.issue.number }}

### Validation procedure

1. Read the issue title and body from the triggering issue.
2. Read and parse the required sections from the template definition in .github/ISSUE_TEMPLATE/01-user-story.yml.
3. Determine whether the issue conforms to the template intent and required content quality.

A conforming issue should include, at minimum:
- Short summary (one-line outcome)
- User story statement in the pattern: As a ..., I want to ..., so that ...
- Problem section with current situation, affected users, impact, and examples/evidence
- Dependencies/assumptions/blockers/related work
- Testable acceptance criteria (prefer Given/When/Then)
- In scope list
- Out of scope list

### Decision rules

- If the issue is clearly conforming and sufficiently complete, do not post any comment.
- If one or more required sections are missing, too vague, or not testable, post exactly one comment.

### Comment requirements when non-conforming

When posting a comment:
- Be constructive and concise.
- Start with a short explanation of what is missing.
- Then provide a complete, improved proposal the author can copy, with this exact section structure:
  - Short summary
  - User story statement
  - Problem
  - Dependencies
  - Acceptance criteria
  - In scope
  - Out of scope
- Ground your proposal in the original issue intent. Do not invent unrelated scope.
- Keep acceptance criteria testable.

## Safe Outputs

- Use add-comment for issue feedback.
- Do not use any write action other than the configured safe output.
