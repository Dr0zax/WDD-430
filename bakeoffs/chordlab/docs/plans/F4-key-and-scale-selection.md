# F4 — Key and Scale Selection

> Implementation plan. Source: `WDD430_Project_Spec.docx` (MVP core feature: scale and key selection).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F4 |
| **Section** | Scale exploration |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2 |
| **Unblocks** | F5, F11 |

## 1. Problem Statement

Users need to choose a musical context before ChordLab can show useful chords. A clear key and scale control makes the first interaction understandable for beginners.

## 2. Goals

- Load supported scales from the API.
- Let users select root and scale with a visible current context.
- Persist the active context while navigating the build flow.

## 3. Non-Goals

- No progression generation or saved preferences.

## 4. Personas & User Stories

- **As a beginner**, I want to select C major so I can see compatible chords.

## 5. Functional Requirements

- **FR-1.** The UI MUST show available roots and scales from `GET /api/scales`.
- **FR-2.** A selection MUST update the active context without a full-page reload.
- **FR-3.** Loading, empty, invalid, and API-error states MUST be visible.

## 6. Non-Functional Requirements

- **Accessibility** — labeled controls, keyboard operation, and announced changes.
- **Performance** — selection feedback SHOULD appear within 100 ms after data is loaded.

## 7. Acceptance Criteria

- **AC-1.** Given the scale list is loaded, when a user selects a key and scale, then the active context is shown.
- **AC-2.** Given the API fails, when the selector opens, then a retry action is available.

## 8. Data Model

Use the F2 Scale shape; no new persistence.

## 9. API Surface

Consume `GET /api/scales` and optionally `GET /api/scales/:scaleId`.

## 10. UI / UX

Add a responsive key/scale selector above the chord exploration area.

## 11. Dependencies & Sequencing

- Must ship after: F2.
- Must ship before: F5 and F11.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unsupported scale appears selectable | L | M | Render only API-provided options and validate server-side. |

## 13. Rollout Plan

Release as the default Build route; rollback hides the selector and restores the shell state.

## 14. Test Plan

Component tests for selection and error states; Playwright test for choosing a scale on desktop and mobile.

## 15. Documentation & Training

Add a short help note explaining key versus scale.

## 16. Open Questions

1. Which minor-scale variants are in the first supported catalog?

## 17. References

- `WDD430_Project_Spec.docx`, MVP core features and Scale model.
