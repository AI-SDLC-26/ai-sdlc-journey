Project intent:
This repository is a local-first demonstration of an AI-assisted software delivery lifecycle. It intentionally uses a small full-stack app to maximize clarity, repeatability, and teaching value. The constitution must optimize for explainability and reliable demos, not production-grade scale.

Project context:

1. Backend is an ASP.NET Core Minimal API focused on endpoint-first development.
2. Frontend is a React plus TypeScript SPA with route-based authenticated and unauthenticated flows.
3. Auth is JWT-based for demo flows.
4. The stack is split into independently runnable SPA and API apps.
5. Tests exist for backend behavior and frontend behavior.
6. OpenSpec artifacts are already used for proposal, design, requirements, and task breakdown.

Constitution goals:

1. Keep the architecture intentionally small and understandable in one sitting.
2. Enforce secure-by-default behavior while acknowledging local demo constraints.
3. Keep requirements testable and scenario-driven.
4. Prevent scope creep into production infrastructure concerns unless explicitly approved.
5. Preserve reproducibility for live demos and workshops.

Non-negotiable principles:

1. Demo-first simplicity
All implementation decisions must prefer clarity and teaching value over architectural complexity.
2. Local-first reliability
The full solution must run locally with minimal setup and without cloud dependencies in the baseline scope.
3. Explicit security posture
Protected endpoints must require authentication by default. Public exceptions must be explicit and justified.
4. Contract discipline
API behavior and SPA integration must evolve together. Contract-impacting changes require synchronized client updates and test updates.
5. Test-backed behavior
Every meaningful feature change must include or update automated tests for success paths, failure paths, and authorization behavior where relevant.
6. Explicit non-goals
Features outside demo scope must be documented as non-goals unless a change explicitly promotes them to in-scope.
7. Spec-driven change management
Changes must begin with structured OpenSpec artifacts that state why, what, requirements, scenarios, risks, and tasks.
8. Reproducibility and hygiene
Build artifacts, generated outputs, and local-only files must stay out of version control. Run instructions must remain accurate.

Architecture invariants:

1. API remains Minimal API and endpoint-centric unless a formal change proposes otherwise.
2. SPA and API remain separately runnable local applications.
3. Auth state management in SPA remains simple and explicit.
4. Baseline demo remains stateless by design unless persistence is explicitly introduced through a change.

Security and risk guardrails:

1. Local demo credentials and configuration are demo-only and must never be treated as production defaults.
2. Any expansion of auth, identity, or permissions must include threat-aware rationale.
3. Secrets handling and dependency hygiene are mandatory for all contributed code.
4. Security concerns discovered during implementation must be documented in the change artifacts.

Quality gates:

1. Backend tests pass.
2. Frontend tests pass.
3. Lint and build checks pass.
4. End-to-end demo flow remains functional: login, protected access, and expected UI behavior.
5. Requirement-to-test traceability is maintained for new or changed requirements.