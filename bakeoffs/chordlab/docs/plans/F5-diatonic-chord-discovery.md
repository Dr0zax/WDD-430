# F5 — Diatonic Chord Discovery

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Find diatonic chords for selected scale).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F5 |
| **Section** | Scale exploration |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2, F4 |
| **Unblocks** | F8, F10 |

## 1. Problem Statement

After choosing a scale, users need to see which chords belong to it. This is the central bridge between music theory and experimentation.

## 2. Goals

- Display all diatonic chords with symbols and Roman numerals.
- Show chord notes and harmonic function on selection.
- Provide a useful empty/error state.

## 3. Non-Goals

- No extended jazz chords, progression suggestions, or playback.

## 4. Personas & User Stories

- **As a music student**, I want to see I–vii° so I can learn how a scale is harmonized.

## 5. Functional Requirements

- **FR-1.** The system MUST request chords for the selected scale.
- **FR-2.** Each result MUST show symbol, quality, Roman numeral, and function.
- **FR-3.** Selecting a chord MUST expose its notes.

## 6. Non-Functional Requirements

- **Accessibility** — chord cards MUST be keyboard and screen-reader usable.
- **Performance** — results SHOULD render within 500 ms of a successful response.

## 7. Acceptance Criteria

- **AC-1.** Given C major, when results load, then seven ordered diatonic chords appear.
- **AC-2.** Given a chord card is focused, when Enter is pressed, then its details open.

## 8. Data Model

Use F2 Chord data; no new tables.

## 9. API Surface

Consume `GET /api/scales/:scaleId/chords`.

## 10. UI / UX

Implement chord cards/list, selected state, details panel, loading, error, and no-results states.

## 11. Dependencies & Sequencing

- Must ship after: F2 and F4.
- Must ship before: F8 and F10.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cards overwhelm small screens | M | M | Use responsive grid/list and progressive detail disclosure. |

## 13. Rollout Plan

Release to the Build route with a feature flag; rollback removes the chord results panel.

## 14. Test Plan

Unit-test rendering and selection; contract-test response mapping; E2E-test C major and an API error.

## 15. Documentation & Training

Add concise explanations for Roman numerals and harmonic function.

## 16. Open Questions

1. Should diminished symbols use Unicode or ASCII fallback?

## 17. References

- `WDD430_Project_Spec.docx`, Chord model and Scales/Chords endpoints.
