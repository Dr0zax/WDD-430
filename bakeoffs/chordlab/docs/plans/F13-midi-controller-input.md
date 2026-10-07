# F13 — MIDI Controller Input

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Additional feature: MIDI support for MIDI controllers).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F13 |
| **Section** | Input extensions |
| **Severity** | MINOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F7 |
| **Unblocks** | F14 |

## 1. Problem Statement

Keyboard and mouse input are useful but slow for musicians with hardware. MIDI input lets a user play notes naturally into the same chord-input path.

## 2. Goals

- Detect available MIDI devices and allow one to be selected.
- Convert note-on/off events into F7 note selections.
- Clearly report permission, connection, and unsupported-browser states.

## 3. Non-Goals

- MIDI output, recording, automation, or full device configuration.

## 4. Personas & User Stories

- **As a pianist**, I want to play a chord on my controller so ChordLab can detect it.

## 5. Functional Requirements

- **FR-1.** The app MUST request MIDI access only after an explicit user action.
- **FR-2.** Note-on/off events MUST map to the F7 input model.
- **FR-3.** Disconnects MUST clear stale device state and notify the user.

## 6. Non-Functional Requirements

- **Security** — device access MUST be opt-in and limited to the active page.
- **Reliability** — duplicate or out-of-order events MUST not create duplicate notes.

## 7. Acceptance Criteria

- **AC-1.** Given permission and a device, when a triad is played, then F7 shows the three active notes.
- **AC-2.** Given permission is denied, then the UI explains how to continue with the on-screen keyboard.

## 8. Data Model

No persistent model; use MIDI device metadata only in session state.

## 9. API Surface

No server endpoint; browser Web MIDI events feed F7.

## 10. UI / UX

Add an opt-in MIDI panel, device selector, connection status, and fallback instructions.

## 11. Dependencies & Sequencing

- Must ship after: F7.
- Must ship before: F14 MIDI import analysis.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Browser support varies | H | M | Detect capability and preserve the on-screen keyboard path. |

## 13. Rollout Plan

Ship behind `chordlab.midi_input`; rollback disables device access without affecting F7.

## 14. Test Plan

Unit-test event translation with fixtures; manually test connect/disconnect and permission denial; E2E-test capability fallback.

## 15. Documentation & Training

Add supported-browser and connection troubleshooting notes.

## 16. Open Questions

1. Which browsers are in the supported MVP matrix?

## 17. References

- `WDD430_Project_Spec.docx`, Additional Features.
