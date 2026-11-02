# AI-Powered SDLC Demo (GitHub Copilot)

## Goal

Show how AI supports the full software development lifecycle:

* From issue definition
* Through implementation
* To security and pull request review

Focus: **practical workflow, not theory**

## Step 0 — Setup

### Repository

* Frontend: authenticated `/users` page with native HTML table
* Backend: authenticated `GET /api/users` endpoint with deterministic empty mode
* Project builds successfully

### Copilot Configuration

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

## Step 1 — Improve Issue Quality (LF)

Start with a weakly defined [issue](https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/1):

```md
As a user, I want to see my data in a new table in the browser. [...]
```

Use a GitHub Agentic Workflow (AW) with a template to refine it:

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

## Step 2 — Retrieve the Issue (MCP) (LF)

After refining the issue, bring it into the workspace using GitHub MCP.

```text
Retrieve issue number 2 of this repository from GitHub and load it into the workspace for analysis and implementation planning.
```

Outcome:

* Structured input ready for planning
* No manual context switching

## Step 3 — Task breakdown with agent (LF)

Use the planning agent to break down the issue into tasks, and create GitHub
issues for each task.

```text
/project-planning-breakdown-feature-implementation using the GitHub MCP downlaod the issue #2 of this repository, then evaluate the current #codebase and ask any questions you need to clarify the requirements before creating the plan. Once you have a clear understanding of the requirements, create a step by step implementation plan in the #plans folder with the number and short name of the issue, for example: "2-user-table-plan.md".
```

## Step 4 — Implementation live improving the original mess (DR)

Use skills (frontend + backend) and agents for code generation. Introduce a
secret in the code to show security checks later, and also a vulnerable package.

Our goal here is to improve the code and show GHAS in action

```text
# Select the C# Expert agent from the organization

Using subagents and skills, I want you to plan a refactor of the REST API.

First, you should break the #Program.cs into multiple files following C# Best Design principles. Then, assess if we have more oportunities to improve the code structure, suggest at least 2 of them first, prioritized by impact in quality and once aproved implement them.
```

Check the result of this plan at `4-refactor-implementation-plan.md`.

What to highlight:

* Where to get those skills and agents
    * Awesome copilot, Skills.sh, and Autoskills...
* Code follows conventions
* AI output is guided, not free-form
* Introduce a secret for later checking

Key point:

* We understand how to gather the right tools for our AI-powered SDLC
* Commercial vs. custom agents and skills, including marketplaces
* AI operates within defined standards
* We help agents perform better through better guidance#
* We understand that leaking a secret is an actual risk

## Step 4.1 - Importance of the context

Agents rely on context for commands, structure, and conventions. Stale guidance
can send them down the wrong path, even when the code is correct.

Run the [Context Gatekeeper AW](../.github/workflows/context-gatekeeper.md):

* Compare agent instructions and ADRs with the actual code and CI
* Show drift: Spec Kit was removed, but [AGENTS.md](../AGENTS.md) still references its plan
* Open one issue with evidence and suggested context fixes; file owners decide
* If everything matches, create no issue

Key point:

* Good context must stay accurate as the repository evolves

## Step 5 — Security and Guardrails (DR)

Demonstrate built-in protections in GitHub + Copilot. How?

```bash
# 1. Add a secret in the .env file with a GitHub PAT
echo "GITHUB_PAT=your_github_pat_here" >> .env

# 2. Attempt to commit the .env file with the secret and the previously created
# code in step 4.
git commit ...

# 3. Evaluate what happens on the terminal

# 4. Show the security panels (Security & Quality) in GitHub Advanced Security
#   - Dependabot
#   - Secret scanning
#   - Code scanning
#   - The PR created by Dependabot

```

Key ideas:

### Push Protection

* Attempt to commit secret
* Show GitHub Advanced Security blocking it
* Only the Security Team can bypass the secret protection

### Dependency Risk

* Introduce vulnerable package
* Show Dependabot alert

Key point:

* AI code is treated the same as human code
* Guardrails are mandatory and can be automated

### Supply Chain Monitoring

Show Dependabot insights:

* Vulnerabilities
* CVE references
* Suggested fixes

Key point:

* Security is continuous, not a phase

## Step 6 — Code Quality Analysis (LF)

Explore CodeQL either the automatic workflow or tuned-in to show:

* Show findings (if any)
* Highlight supported stacks:
    * TypeScript
    * .NET

Key point:

* Quality and security are integrated

## Step 7 — Pull Request Review (LF)

Push changes & create a PR for the previously implemented feature (refactor Program.cs).
> If we have enough time, show the (repository / organization codding agents)
in GitHub (C# Exert, Security Reviewer...).

Show how AI can assist in PR review:

* Introduce a deliberate issue pre-cooked and show the PR conversation (PR-Review)
* Show the use of specific custom agents for PR review like C# Expert or
Security Reviewer.

Show:

* Suggested improvements
* Alignment with organization rules
* Custom agent on top of org-wide instructions for specific feedback??

Key point:

* Enables consistent reviews across teams
* Helps as first-pass feedback, not a replacement for human judgment

## Step 8 — Token Optimization (TR)

Show techniques:

* Compact prompts
* Reusable instructions
* Semantic anchors
* Token usage reducers
* Token audit: /chronicle (CLI)

Key point:

* Efficiency matters in real usage
* Billing changed from May 2026

References:

* <https://ashy-dune-0b4215a0f.7.azurestaticapps.net/>
* <https://github.com/rtk-ai/rtk>

## Additional 1 — Organization Standards -> This is a cross feature

Show custom instructions:

* Naming conventions
* Architecture guidelines
* Security policies

Outcome:

* Consistent AI-generated output

Key point:

* Governance is centralized

## Additional 2 — Remote Control -> This is a cross feature

Show how AI can be used from a mobile device to review sessions and trigger
follow-up action. Use of `/remote` from the GitHub CLI.

## Summary

* AI supports the entire SDLC, not just coding
* Work remains structured and reviewable
* Security and quality are enforced through automation
* Teams gain consistency and speed without losing control
