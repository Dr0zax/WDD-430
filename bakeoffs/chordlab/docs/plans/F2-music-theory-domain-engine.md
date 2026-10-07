# F2 — Music Theory Domain Engine

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Scale and Chord data models).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F2 |
| **Section** | Domain foundation |
| **Severity** | BLOCKER |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | infrastructure/supporting |
| **Depends on** | F1 |
| **Unblocks** | F4, F5, F6, F7, F9, F10, F11, F14 |

## 1. Problem Statement

All chord features require one consistent representation of notes, intervals, scales, chord qualities, Roman numerals, and harmonic functions. Without a shared engine, the UI and API can disagree about valid chords.

## 2. Goals

- Implement typed Scale and Chord models matching the specification.
- Provide note normalization, interval, transposition, and diatonic derivation helpers.
- Seed a small deterministic catalog for common major and minor scales and triads.

## 3. Non-Goals

- No advanced jazz extensions, MIDI parsing, or UI.

## 4. Personas & User Stories

- **As a student**, I want chord names and notes to be musically consistent.
- **As a developer**, I want pure functions that can be reused by every feature.

## 5. Functional Requirements

- **FR-1.** The engine MUST represent roots, intervals, notes, quality, symbol, Roman numeral, and function.
- **FR-2.** Given a root and scale, it MUST return ordered diatonic chords.
- **FR-3.** Equivalent enharmonic input MUST normalize deterministically.

## 6. Non-Functional Requirements

- **Reliability** — pure calculations MUST be deterministic and side-effect free.
- **Performance** — common derivations SHOULD complete in under 10 ms.
- **Maintainability** — fixtures MUST cover every supported scale and chord quality.

## 7. Acceptance Criteria

- **AC-1.** Given C major, when diatonic chords are requested, then I through vii° and their notes are returned in order.
- **AC-2.** Given a chord definition, when transposed, then intervals remain unchanged and notes shift correctly.
- **AC-3.** Invalid roots or malformed intervals return typed validation errors.

## 8. Data Model

Implement the Scale and Chord shapes from the specification; IDs MUST be stable and unique.

## 9. API Surface

Support `GET /api/scales`, `GET /api/scales/:scaleId`, `GET /api/scales/:scaleId/chords`, `GET /api/chords`, and `GET /api/chords/:chordId`.

## 10. Integration Points

Shared by UI feature modules and future server handlers; no external service required.

## 11. Dependencies & Sequencing

- Must ship after: F1.
- Must ship before: F4, F5, F6, F7, F9, F10, F11, F14.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Enharmonic spelling becomes inconsistent | M | H | Define normalization and snapshot-test representative keys. |

## 13. Rollout Plan

Ship as a library/module with seeded read-only data; rollback is restoring the previous domain module.

## 14. Test Plan

Unit-test note math, scale/chord fixtures, invalid input, and API serialization; add contract tests for the five read endpoints.

## 15. Documentation & Training

Document supported keys, scales, chord qualities, and extension points for future jazz harmony.

## 16. Open Questions

1. Should enharmonic spellings be key-aware in the first release?

## 17. References

- `WDD430_Project_Spec.docx`, Scale and Chord models and Scales/Chords endpoints.
