# ChordLab Two Week MVP

The manageable two-week target is one complete local workflow: choose a key and scale, explore its chords, build a progression, and hear it. Keep the first release single-user and in-memory; defer accounts, persistence, advanced theory, and hardware/file integrations.

## Recommended implementation order

| Order | Feature ID | Depends on | Why this order |
|---:|---|---|---|
| 1 | F1 | None | Establishes the existing app shell, shared UI states, API boundary, and test baseline. |
| 2 | F2 | F1 | Provides the note, scale, chord, and progression rules used by every MVP feature. |
| 3 | F4 | F2 | Lets the user choose the musical context for exploration. |
| 4 | F5 | F2, F4 | Shows the diatonic chords that can be added to a progression. |
| 5 | F7 | F2 | Supports direct chord entry through the on-screen piano. |
| 6 | F8 | F5, F7 | Connects discovered and entered chords into one editable progression. |
| 7 | F9 | F2, F8 | Completes the core feedback loop by playing the chord progression. |

## Two-week delivery target

Plan for roughly ten implementation days plus four days for integration, testing, accessibility, and bug fixes:

- Days 1–2: F1 foundation and F2 domain rules.
- Days 3–4: F4 key/scale selection and F5 diatonic chord display.
- Days 5–7: F7 piano input and F8 progression workspace.
- Days 8–9: F9 simple chord/progression playback.
- Days 10–14: integration, responsive behavior, accessibility, test coverage, and polish.

## MVP boundaries

Include:

- Major scales and basic triads only.
- One Build page with a key/scale selector, chord list, piano input, progression list, and play/stop controls.
- In-memory state; refreshing the page may clear the current progression.
- Simple browser audio using the smallest reliable implementation.

Defer until after the MVP:

- F3 user accounts and F12 saved progressions.
- F6 piano/guitar voicing diagrams.
- F10 next-chord suggestions and F11 genre-aware generation.
- F13 MIDI controller input, F14 advanced jazz harmony, and F15 MIDI-file analysis.

## Scope guardrails

- Do not add a backend unless the browser-only MVP cannot meet a requirement.
- Do not support minor-scale variants, seventh chords, alternate tunings, or genre rules in this slice.
- Do not add drag-and-drop unless there is time after keyboard-accessible reorder controls work.
- Treat playback as a simple preview, not a sequencer, recorder, or export system.
