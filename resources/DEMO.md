# AI-Powered SDLC Demo (GitHub Copilot)

## Goal

Show how AI supports the full software development lifecycle:

* From issue definition
* Through implementation
* To security and pull request review

Focus: **practical workflow, not theory**

# Step 0 — Setup

## Repository

* Frontend: table UI (basic scaffold)
* Backend: API endpoint (minimal)
* Project builds successfully

## Copilot Configuration

* Custom instructions (organization-level)
* Custom agents:
  * Planning
  * Implementation
  * Security
  * PR review
* Skills available:
  * Planning
  * Vertical slicing
  * Implementation

# Step 1 — Improve Issue Quality

Start with a weakly defined issue:

```md
Show user data in a table
```

Use a GitHub Agentic Workflow (AW) with a template to refine it:

* Ask clarifying questions
* Add missing details
* Define acceptance criteria
* Get the issue ready for implementation

Result:

```md
### Refined Issue
As a user, I want to see my data in a table. I should be able to view all data fields in the SPA after querying the endpoint from the REST API.

### Acceptance Criteria
- Columns: name, role, status
- Data comes from the backend API
- Loading and error states are handled
```

Key point:

* Quality is enforced before coding starts

# Step 2 — Retrieve the Issue (MCP)

After refining the issue, bring it into the workspace using GitHub MCP.

Outcome:

* Structured input ready for planning
* No manual context switching

# Step 3 — Planning (Spec Driven Development)

Generate an implementation plan using Spec Kit.

Output:

* Task breakdown:
  * Create API endpoint
  * Create frontend table
  * Integrate data
  * Add validation
  * Manage loading states and errors

Key point:

* AI structures the work before implementation

# Step 4 — Vertical Slicing

Use a vertical-slicing skill to break the work into small, iterative slices:

Example slices:

1. Backend endpoint (minimal)
2. Frontend table (mock data)
3. Integration

Key point:

* Prefer incremental delivery over large tasks

# Step 5 — Implementation

Use skills (frontend + backend) and agents for code generation. 


What to highlight:
* Where to get those skills and agents
    * Awesome copilot, Skills.sh, and Autoskills...
* Code follows conventions
* AI output is guided, not free-form


Key point:

* We understand how to gather the right tools for our AI-powered SDLC
* Commercial vs. custom agents and skills, including marketplaces
* AI operates within defined standards
* We help agents perform better through better guidance

# Step 6 — Security and Guardrails

Demonstrate built-in protections in GitHub + Copilot.

## Push Protection

* Attempt to commit secret
* Show GitHub Advanced Security blocking it

## Dependency Risk

* Introduce vulnerable package
* Show Dependabot alert

## Automated Checks

* Linting hooks
* Security agent review

Optional:

* CodeQL scan

Key point:

* AI code is treated the same as human code
* Guardrails are mandatory and can be automated

# Step 7 — Supply Chain Monitoring

Show Dependabot insights:

* Vulnerabilities
* CVE references
* Suggested fixes

Key point:

* Security is continuous, not a phase

# Step 8 — Code Quality Analysis

Run CodeQL:

* Show findings (if any)
* Highlight supported stacks:
  * TypeScript
  * .NET

Key point:

* Quality and security are integrated

# Step 9 — Pull Request Review

Create a PR:

* Introduce a deliberate issue pre-cooked and show the PR conversation (PR-Review)

Show:

* Suggested improvements
* Alignment with organization rules
* Custom agent on top of org-wide instructions for specific feedback??

Key point:

* Enables consistent reviews across teams
* Helps as first-pass feedback, not a replacement for human judgment

# Step 10 — Organization Standards

Show custom instructions:

* Naming conventions
* Architecture guidelines
* Security policies

Outcome:

* Consistent AI-generated output

Key point:

* Governance is centralized

# Additional Step 11 — Token Optimization

Show techniques:

* Compact prompts
* Reusable instructions
* Semantic anchors
* Token usage reducers

Key point:

* Efficiency matters in real usage
* Billing changed from May 2026

# Additional Step 12 — Remote Control

Show how AI can be used from a mobile device to review sessions and trigger follow-up actions.

# Summary

* AI supports the entire SDLC, not just coding
* Work remains structured and reviewable
* Security and quality are enforced through automation
* Teams gain consistency and speed without losing control
