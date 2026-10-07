# F10 — Next Chord Suggestions

> Implementation plan. Source: `WDD430_Project_Spec.docx` (List of chords that could come next based on selected chord).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F10 |
| **Section** | Exploration assistance |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2, F5 |
| **Unblocks** | F11 |

## 1. Problem Statement

Beginners often know the first chord but not where to go next. A deterministic, explainable suggestion list provides immediate creative direction without requiring advanced theory.

## 2. Goals

- Return likely next chords for the selected chord within the active scale.
- Explain suggestions using Roman numerals or harmonic function.
- Allow a suggestion to be added to the workspace.

## 3. Non-Goals

- No machine-learning ranking or personalized taste model.

## 4. Personas & User Stories

- **As a beginner songwriter**, I want possible next chords so I can continue an idea.

## 5. Functional Requirements

- **FR-1.** Suggestions MUST be limited to compatible chords for the active scale.
- **FR-2.** Results MUST include a reason or harmonic function.
- **FR-3.** Users MUST be able to add a suggestion to F8.

## 6. Non-Functional Requirements

- **Explainability** — the ranking rules MUST be documented and deterministic.
- **Performance** — suggestions SHOULD render within 500 ms.

## 7. Acceptance Criteria

- **AC-1.** Given C major and C, when suggestions load, then compatible candidates are shown with explanations.
- **AC-2.** Given a suggestion is selected, when Add is pressed, then it enters the progression workspace.

## 8. Data Model

Use F2 Chord and function fields; no new persistent model.

## 9. API Surface

Add a typed suggestion service; if server-backed, document `GET /api/chords/:chordId/next`.

## 10. UI / UX

Add a suggestion panel beside selected chord details with loading, empty, and error states.

## 11. Dependencies & Sequencing

- Must ship after: F2 and F5.
- Must ship before: F11.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| “Likely” feels arbitrary | M | M | Show transparent rule-based reasons and keep ranking simple. |

## 13. Rollout Plan

Release behind a suggestion flag; rollback hides the panel.

## 14. Test Plan

Unit-test ranking rules and edge keys; API contract-test payloads; E2E-test add-to-workspace.

## 15. Documentation & Training

Explain that suggestions are theory-based starting points, not guarantees.

## 16. Open Questions

1. Which harmonic rules define “likely” for the first release?

## 17. References

- `WDD430_Project_Spec.docx`, next-chord feature and Chord model.
