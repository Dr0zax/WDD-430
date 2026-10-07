# F6 — Chord Details and Instrument Voicings

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Representations of chords for piano and guitar).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F6 |
| **Section** | Chord reference |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2 |
| **Unblocks** | F7, F9 |

## 1. Problem Statement

Knowing a chord symbol is not enough for piano and guitar learners; they need playable note and shape representations.

## 2. Goals

- Show piano notes and guitar shapes for a selected chord.
- Support the specified Guitar Voicing fields, including frets, fingers, tuning, and barre.
- Make unavailable voicings explicit.

## 3. Non-Goals

- No full guitar-fretboard editor or alternate tunings beyond the seeded data.

## 4. Personas & User Stories

- **As a guitarist**, I want a fret shape so I can play the selected chord.
- **As a pianist**, I want the chord notes so I can voice it on a keyboard.

## 5. Functional Requirements

- **FR-1.** The system MUST expose chord voicings via `GET /api/chords/:chordId/voicings`.
- **FR-2.** Guitar shapes MUST show strings, frets, fingers, tuning, and barre where present.
- **FR-3.** The UI MUST distinguish unavailable data from a loading failure.

## 6. Non-Functional Requirements

- **Accessibility** — diagrams MUST have text equivalents.
- **Performance** — voicing details SHOULD load within 500 ms.

## 7. Acceptance Criteria

- **AC-1.** Given C major, when details open, then piano notes and available guitar shape data are visible.
- **AC-2.** Given no shape exists, when guitar view opens, then a clear explanation is shown.

## 8. Data Model

Implement the Guitar Voicing model from the specification.

## 9. API Surface

Consume `GET /api/chords/:chordId/voicings` and `GET /api/chords/:chordId/guitar-shapes`.

## 10. UI / UX

Add chord detail tabs or sections for notes, piano, and guitar.

## 11. Dependencies & Sequencing

- Must ship after: F2.
- Must ship before: F9; informs F7.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Diagram is ambiguous on mobile | M | M | Provide text labels and responsive SVG/CSS layout. |

## 13. Rollout Plan

Release from chord selection; rollback hides voicing sections without changing chord data.

## 14. Test Plan

Unit-test mapping, visual smoke-test representative shapes, and E2E-test missing-voicing behavior.

## 15. Documentation & Training

Explain fret notation and piano note notation in contextual help.

## 16. Open Questions

1. How many seeded guitar shapes are required for MVP coverage?

## 17. References

- `WDD430_Project_Spec.docx`, Guitar Voicing model and Chord endpoints.
