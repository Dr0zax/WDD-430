# F1 — Project Foundation and Design System

> Implementation plan. Source: `WDD430_Project_Spec.docx` (wireframes and MVP feature set).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F1 |
| **Section** | Foundation |
| **Severity** | BLOCKER |
| **Markets** | Web |
| **Status (today)** | PARTIAL |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | infrastructure/supporting |
| **Depends on** | None |
| **Unblocks** | F2, F3 |

## 1. Problem Statement

The prototype has a Vite/React shell and a piano component but no shared application structure, routing, error states, or visual rules. A stable foundation lets every feature use consistent navigation, responsive behavior, and testable boundaries.

## 2. Goals

- Establish the web app shell, routes, and responsive layout.
- Define reusable controls, typography, colors, spacing, and form states.
- Add environment-safe API configuration, linting, and test commands.

## 3. Non-Goals

- No music-theory behavior or persistence beyond health-check plumbing.
- No production deployment redesign.

## 4. Personas & User Stories

- **As a learner**, I want a predictable interface so I can focus on experimenting with chords.
- **As a developer**, I want shared components and scripts so later features are cheap to implement.

## 5. Functional Requirements

- **FR-1.** The app MUST expose Build and Progressions routes with loading, empty, and error states.
- **FR-2.** Shared buttons, inputs, panels, and notification components MUST be keyboard accessible.
- **FR-3.** The app MUST use a single typed API client configuration.

## 6. Non-Functional Requirements

- **Accessibility** — WCAG 2.1 AA for added UI.
- **Performance** — initial app shell SHOULD load in under 2 seconds on a normal broadband connection.
- **Maintainability** — components and API modules MUST have clear ownership and tests.

## 7. Acceptance Criteria

- **AC-1.** Given a fresh checkout, when install and test commands run, then they complete successfully.
- **AC-2.** Given a narrow viewport, when the app opens, then navigation and the piano remain usable without horizontal page overflow.
- **AC-3.** Given an API failure, when a route loads, then a retryable error is shown.

## 8. Data Model

No persistent model changes.

## 9. API Surface

Add a typed client wrapper and a health/readiness contract placeholder; document the base URL without embedding secrets.

## 10. UI / UX

Implement the shell, navigation, responsive page container, focus styles, and reusable empty/loading/error states.

## 11. Integration Points

Touches `bakeoffs/chordlab/src/App.tsx`, `src/index.css`, and future `src/api` modules.

## 12. Dependencies & Sequencing

- Must ship before: F2, F3.
- Shared infra needed: test runner, API configuration, component conventions.

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Foundation overgrows into a framework rewrite | M | M | Limit work to shell, shared primitives, and scripts. |

## 14. Rollout Plan

Ship behind the existing app entry point; rollback is reverting the shell commit.

## 15. Test Plan

Unit-test shared state components; run keyboard and responsive exploratory checks; add one route smoke test.

## 16. Documentation & Training

Document local setup, component conventions, and API configuration.

## 17. Open Questions

1. Which backend hosting target will provide the API base URL?

## 18. References

- `bakeoffs/chordlab/src/App.tsx`
- `bakeoffs/chordlab/src/components/PianoKeyboard.tsx`
