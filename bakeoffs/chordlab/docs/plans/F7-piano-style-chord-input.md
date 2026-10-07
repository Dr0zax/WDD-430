# F7 — Piano Style Chord Input

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Inactive piano-like interface for inputting chords).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F7 |
| **Section** | Input |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | PARTIAL |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F2 |
| **Unblocks** | F8, F13 |

## 1. Problem Statement

The prototype renders a keyboard but only logs individual key presses. Users need to select multiple notes and submit them as a chord input.

## 2. Goals

- Track pressed notes and clear/reset them.
- Display the selected note names and inferred chord when possible.
- Keep mouse, touch, and keyboard interactions consistent.

## 3. Non-Goals

- MIDI hardware input, audio playback, or a full sequencer.

## 4. Personas & User Stories

- **As a learner**, I want to click notes on a piano so I can discover what chord they form.

## 5. Functional Requirements

- **FR-1.** The keyboard MUST support note selection and deselection.
- **FR-2.** The system MUST expose a submit/reset action for the selected notes.
- **FR-3.** Invalid or incomplete note sets MUST receive a readable explanation.

## 6. Non-Functional Requirements

- **Accessibility** — every key MUST have a label and keyboard path.
- **Performance** — visual key state MUST update without perceptible lag.

## 7. Acceptance Criteria

- **AC-1.** Given three notes are selected, when submit is pressed, then the selected MIDI/note values are emitted as one input.
- **AC-2.** Given reset is pressed, then all selected state clears.

## 8. Data Model

Use F2 note/chord shapes; no persistence.

## 9. API Surface

Prepare the payload used by `POST /api/chords/detect`.

## 10. UI / UX

Complete `PianoKeyboard` interaction, selected-note summary, submit, reset, and error messaging.

## 11. Dependencies & Sequencing

- Must ship after: F2.
- Must ship before: F8 and F13.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Touch interaction creates accidental notes | M | M | Use explicit press/release behavior and add mobile tests. |

## 13. Rollout Plan

Replace the current logging-only behavior; rollback restores logging-only keyboard behavior.

## 14. Test Plan

Component-test selection, reset, and keyboard focus; E2E-test mouse, touch viewport, and keyboard use.

## 15. Documentation & Training

Add a short “Select notes, then submit” hint.

## 16. Open Questions

1. Should chord detection happen only on submit or also while selecting?

## 17. References

- `bakeoffs/chordlab/src/components/PianoKeyboard.tsx`
- `WDD430_Project_Spec.docx`, Chord detection endpoint.
