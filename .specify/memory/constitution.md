<!--
Sync Impact Report
- Version change: 0.0.0-template -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. Demo-First Simplicity
	- Template Principle 2 -> II. Local-First Reliability
	- Template Principle 3 -> III. Explicit Security Posture
	- Template Principle 4 -> IV. Contract Discipline
	- Template Principle 5 -> V. Test-Backed Behavior
- Added sections:
	- Core Principles: VI. Explicit Non-Goals
	- Core Principles: VII. Spec-Driven Change Management
	- Core Principles: VIII. Reproducibility and Hygiene
	- Architecture Invariants
	- Delivery Guardrails and Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ✅ .specify/templates/commands/*.md (no files present; validation complete)
- Runtime guidance docs reviewed:
	- ✅ README.md (no update required)
	- ✅ .github/copilot-instructions.md (no update required)
- Follow-up TODOs:
	- None
-->

# AI SDLC Journey Constitution

## Core Principles

### I. Demo-First Simplicity
All implementation decisions MUST optimize for explainability, teaching value, and
clarity in a single sitting over architectural sophistication. Contributors MUST
justify any added abstraction by showing concrete demo value.
Rationale: this repository is a workshop and live-demo system, not a scale target.

### II. Local-First Reliability
The baseline solution MUST run locally with minimal setup and without cloud
dependencies. SPA and API MUST remain independently runnable in local developer
environments.
Rationale: reproducible local execution is essential for workshops and repeatable
presentations.

### III. Explicit Security Posture
Protected endpoints MUST require authentication by default. Any public endpoint
exception MUST be explicit in code and justified in the governing spec artifacts.
Demo credentials and settings MUST be treated as demo-only and never implied as
production defaults.

### IV. Contract Discipline
API and SPA integration contracts MUST evolve together. Any contract-impacting
backend change MUST include synchronized client updates and synchronized test
updates before merge.
Rationale: contract drift breaks demos quickly and erodes confidence in AI-assisted
delivery.

### V. Test-Backed Behavior
Every meaningful feature change MUST add or update automated tests that cover
success paths, failure paths, and authorization behavior where relevant. Test
coverage decisions MUST be traceable to requirements and scenarios.

### VI. Explicit Non-Goals
Out-of-scope capabilities MUST be captured as explicit non-goals in spec artifacts.
Production infrastructure concerns (cloud architecture, scale tuning, distributed
state, enterprise IAM) MUST remain out of scope unless explicitly approved by a
change artifact.

### VII. Spec-Driven Change Management
Material changes MUST start from structured OpenSpec artifacts that state why,
scope, requirements, user scenarios, risks, and implementation tasks. Work that
cannot be mapped to approved spec artifacts MUST not proceed.

### VIII. Reproducibility and Hygiene
Run instructions MUST remain accurate for local-first execution. Build artifacts,
generated outputs, and local-only files MUST stay out of version control. Changes
that affect setup or execution MUST update relevant documentation in the same
change.

## Architecture Invariants

- API MUST remain ASP.NET Core Minimal API and endpoint-centric unless a formal
	approved change explicitly replaces this model.
- SPA and API MUST remain separately runnable local applications.
- SPA authentication state management MUST remain simple and explicit.
- Baseline demo behavior MUST remain stateless by design unless persistence is
	introduced by an approved change.

## Delivery Guardrails and Quality Gates

### Security and Risk Guardrails

- Expansions of authentication, identity, or permissions MUST include a
	threat-aware rationale in spec artifacts.
- Secrets handling and dependency hygiene are mandatory for all contributions.
- Security concerns discovered during implementation MUST be documented in change
	artifacts before completion.

### Quality Gates

- Backend automated tests MUST pass.
- Frontend automated tests MUST pass.
- Lint and build checks MUST pass.
- End-to-end demo flow MUST remain functional: login, protected access, and
	expected UI behavior.
- Requirement-to-test traceability MUST be maintained for changed requirements.

## Governance

This constitution supersedes informal practices for this repository.

- Amendment process:
	- Amendments MUST be proposed through OpenSpec change artifacts that describe
		motivation, principle impact, and required template or documentation updates.
	- Amendments MUST include a Sync Impact Report describing downstream updates.
	- Amendments become effective only after repository maintainers approve and the
		dependent templates are aligned or explicitly marked pending.
- Versioning policy:
	- Semantic versioning applies to this constitution.
	- MAJOR: backward-incompatible governance or principle removals/redefinitions.
	- MINOR: new principle/section or materially expanded governance guidance.
	- PATCH: clarifications, wording improvements, and non-semantic edits.
- Compliance review expectations:
	- Every plan, spec, and task artifact MUST include a constitution compliance
		check before implementation begins.
	- Pull requests SHOULD cite impacted principles when introducing behavioral or
		security-significant changes.
	- Reviewers MUST block merges that violate non-negotiable principles without an
		approved amendment.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
