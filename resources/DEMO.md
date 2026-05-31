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

Start with a weakly defined [issue](https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/1):

```md
As a user, I want to see my data in a new table in the browser. [...]
```

Use a GitHub Agentic Workflow (AW) with a template to refine it:

* Ask clarifying questions
* Add missing details
* Define acceptance criteria
* Get the issue ready for implementation

Result:

```md
### Refined Issue
As a stakeholder of the application I want users to be able to see the list of users with their name, role and status, so they are able to get to know them and probably contact in the future.

### Acceptance Criteria
Given an user, when they enter the /users page, then they will be presented with the list of users with (name, status and role).

Given no users, when they enter the /users page, then they will be presented with a "No available users" text.

...
```
More details at [Issue 2.](https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/2)

Key point:

* Quality is enforced before coding starts

# Step 2 — Retrieve the Issue (MCP)

After refining the issue, bring it into the workspace using GitHub MCP.

```bash
Retrieve issue number 2 of this repository from GitHub and load it into the workspace for analysis and implementation planning.
```

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

# Step 3.bis — Task breakdown with agent

Use the planning agent to break down the issue into tasks, and create GitHub issues for each task.

```bash
/project-planning-breakdown-feature-implementation using the GitHub MCP downlaod the issue #2 of this repository, then evaluate the current #codebase and ask any questions you need to clarify the requirements before creating the plan. Once you have a clear understanding of the requirements, create a step by step implementation plan in the #plans folder with the number and short name of the issue, for example: "2-user-table-plan.md".
```

# Step 4 — Implementation

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

# Step 5 — Security and Guardrails

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

# Step 6 — Supply Chain Monitoring

Show Dependabot insights:

* Vulnerabilities
* CVE references
* Suggested fixes

Key point:

* Security is continuous, not a phase

# Step 7 — Code Quality Analysis

Run CodeQL:

* Show findings (if any)
* Highlight supported stacks:
  * TypeScript
  * .NET

Key point:

* Quality and security are integrated

# Step 8 — Pull Request Review

Create a PR:

* Introduce a deliberate issue pre-cooked and show the PR conversation (PR-Review)

Show:

* Suggested improvements
* Alignment with organization rules
* Custom agent on top of org-wide instructions for specific feedback??

Key point:

* Enables consistent reviews across teams
* Helps as first-pass feedback, not a replacement for human judgment

# Step 9 — Organization Standards

Show custom instructions:

* Naming conventions
* Architecture guidelines
* Security policies

Outcome:

* Consistent AI-generated output

Key point:

* Governance is centralized

# Additional Step 10 — Token Optimization

Show techniques:

* Compact prompts
* Reusable instructions
* Semantic anchors
* Token usage reducers

Key point:

* Efficiency matters in real usage
* Billing changed from May 2026

References:
* https://ashy-dune-0b4215a0f.7.azurestaticapps.net/
* https://github.com/rtk-ai/rtk

# Additional Step 11 — Remote Control

Show how AI can be used from a mobile device to review sessions and trigger follow-up action. Use of `/remote` from the GitHub CLI.

# Summary

* AI supports the entire SDLC, not just coding
* Work remains structured and reviewable
* Security and quality are enforced through automation
* Teams gain consistency and speed without losing control
