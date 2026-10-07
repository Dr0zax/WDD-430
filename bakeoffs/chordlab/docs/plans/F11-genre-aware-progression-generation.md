# F11 — Genre Aware Progression Generation

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Progression generation based on scales, selected chords, and genre/style).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F11 |
| **Section** | Generation |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2, F4, F10 |
| **Unblocks** | None |

## 1. Problem Statement

Users want to start from a style or genre instead of an empty workspace. A small, deterministic generator can provide useful starting points while keeping the musical reasoning understandable.

## 2. Goals

- Generate a progression from active key/scale, selected chords, and style.
- Return a bounded number of results with reasons and valid chord IDs.
- Let users load a result into F8.

## 3. Non-Goals

- No generative AI, audio generation, or claims of genre authenticity.

## 4. Personas & User Stories

- **As a songwriter**, I want a pop or jazz starting pattern so I can iterate quickly.

## 5. Functional Requirements

- **FR-1.** The generator MUST accept key, scale, style, length, and optional seed chords.
- **FR-2.** Every returned chord MUST be valid for the selected domain rules.
- **FR-3.** Users MUST be able to preview and load a result into the workspace.

## 6. Non-Functional Requirements

- **Reliability** — a fixed seed MUST reproduce the same result.
- **Performance** — generation SHOULD complete within 1 second.

## 7. Acceptance Criteria

- **AC-1.** Given C major and Pop, when Generate is pressed, then at least one valid bounded-length progression appears.
- **AC-2.** Given a seed chord, then generated results preserve it where requested.
- **AC-3.** Given an unsupported style, then the UI offers a valid fallback.

## 8. Data Model

Use F2 Chord and F8 Progression shapes; style may be an enum/config record.

## 9. API Surface

Document a typed generation endpoint or service with request seed and response explanations.

## 10. UI / UX

Add style, length, and seed controls plus result cards and “Use this progression.”

## 11. Dependencies & Sequencing

- Must ship after: F2, F4, and F10.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Genre rules are too broad to be useful | M | M | Start with a small documented rule set and representative fixtures. |

## 13. Rollout Plan

Release behind `chordlab.progression_generation`; disable the feature flag to roll back.

## 14. Test Plan

Unit-test seeded reproducibility and validity; integration-test requests; E2E-test generation and loading.

## 15. Documentation & Training

Document supported styles and explain that generated ideas are starting points.

## 16. Open Questions

1. Which two or three styles are required for MVP?

## 17. References

- `WDD430_Project_Spec.docx`, Progression model and generation requirement.
