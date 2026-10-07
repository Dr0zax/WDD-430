# F8 — Progression Workspace

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Workspace for building chord progressions).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F8 |
| **Section** | Composition |
| **Severity** | BLOCKER |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F5, F7 |
| **Unblocks** | F9, F12, F14 |

## 1. Problem Statement

Chord exploration becomes useful when users can assemble a sequence, reorder it, and remove mistakes. The workspace is the central composition surface for the MVP.

## 2. Goals

- Add chords to an ordered progression.
- Reorder, remove, and clear items.
- Show key, scale, title placeholder, tempo, and time signature context.

## 3. Non-Goals

- Persistence, playback timing, and MIDI import are separate features.

## 4. Personas & User Stories

- **As a songwriter**, I want to arrange chords into a sequence so I can test an idea.

## 5. Functional Requirements

- **FR-1.** Users MUST be able to add a selected chord to the workspace.
- **FR-2.** Users MUST be able to reorder and remove progression items.
- **FR-3.** The client MUST maintain position and duration fields matching the Progression model.

## 6. Non-Functional Requirements

- **Accessibility** — reorder controls MUST have a keyboard-accessible alternative to drag-and-drop.
- **Reliability** — invalid sequence mutations MUST leave the last valid state intact.

## 7. Acceptance Criteria

- **AC-1.** Given a selected chord, when Add is pressed, then it appears at the end of the sequence.
- **AC-2.** Given four items, when one is moved, then positions are renumbered without duplicates.
- **AC-3.** Given an empty workspace, then a useful empty-state instruction is shown.

## 8. Data Model

Implement the client-side Progression shape: title, key, scale, tempo, time signature, chords, positions, and durations.

## 9. API Surface

Prepare request/response mapping for `/api/progressions`; no writes in this slice.

## 10. UI / UX

Add timeline/list workspace with add, reorder, remove, clear, and empty states.

## 11. Dependencies & Sequencing

- Must ship after: F5 and F7.
- Must ship before: F9, F12, F14.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Drag-only interaction excludes keyboard users | M | H | Provide move up/down controls and live announcements. |

## 13. Rollout Plan

Release on Build route behind a flag; rollback hides the workspace and preserves exploration.

## 14. Test Plan

Unit-test sequence mutations; E2E-test add/reorder/remove/clear and keyboard reorder.

## 15. Documentation & Training

Add a quick-start guide for building a four-chord progression.

## 16. Open Questions

1. Are duration edits needed in the MVP or can the default be four beats?

## 17. References

- `WDD430_Project_Spec.docx`, Progression model and workspace feature.
