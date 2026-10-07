# F9 — Chord and Progression Audio Playback

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Audio playback of chords and progressions).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F9 |
| **Section** | Playback |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2, F8 |
| **Unblocks** | None |

## 1. Problem Statement

Users need to hear whether a chord or progression works, especially beginners who cannot yet read every voicing. Playback turns the workspace from a static list into an instrument.

## 2. Goals

- Play a selected chord and an ordered progression in the browser.
- Respect duration, tempo, and stop/pause state.
- Handle browser audio permission and unsupported environments gracefully.

## 3. Non-Goals

- Recording, exporting audio, or studio-quality synthesis.

## 4. Personas & User Stories

- **As a songwriter**, I want to audition my progression so I can decide whether to keep it.

## 5. Functional Requirements

- **FR-1.** A user MUST be able to play and stop a chord or progression.
- **FR-2.** Progression playback MUST follow item order and duration.
- **FR-3.** The current item MUST be visibly indicated.

## 6. Non-Functional Requirements

- **Performance** — playback start SHOULD occur within 150 ms after user gesture.
- **Reliability** — stop MUST release timers and audio resources.

## 7. Acceptance Criteria

- **AC-1.** Given a selected chord, when Play is pressed, then audible notes start and Stop ends them.
- **AC-2.** Given a progression, when Play Progression is pressed, then each item advances in order.
- **AC-3.** Given audio is unavailable, then a readable fallback explains the limitation.

## 8. Data Model

Use F2 notes and F8 durations; no new persistence.

## 9. API Surface

No new HTTP endpoint.

## 10. UI / UX

Add play/stop controls, progress indicator, and audio permission/error messaging.

## 11. Dependencies & Sequencing

- Must ship after: F2 and F8.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Browser autoplay policy blocks sound | H | M | Start only from user gestures and show a retry hint. |

## 13. Rollout Plan

Feature-flag playback; rollback removes controls without affecting saved progression data.

## 14. Test Plan

Unit-test scheduling and cleanup; E2E-test controls and unsupported-audio fallback; manually verify Chrome and Safari.

## 15. Documentation & Training

Document browser permission behavior and supported browsers.

## 16. Open Questions

1. Which synthesis/sample approach is acceptable for MVP licensing and bundle size?

## 17. References

- `WDD430_Project_Spec.docx`, Audio playback and Progression model.
