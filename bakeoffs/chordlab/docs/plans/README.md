# ChordLab Feature Plans

This directory contains the focused implementation plans for the ChordLab MVP and its optional piano/audio extensions.

## Recommended implementation order

| Order | Feature ID | Feature | Depends on | Why this order |
| --- | --- | --- | --- | --- |
| 1 | F1.1 | Responsive foundation and validation | none | Establishes the shared layout, mobile behavior, error handling, and validation patterns used by every other feature. |
| 2 | F1.2 | User authentication | F1.1 | Completes the required sign-up, log-in, and log-out workflow while the shared form patterns are fresh. |
| 3 | F1.3 | Key, scale, and chord explorer | F1.1 | Delivers the first meaningful music workflow and supplies the chord data needed by the progression builder. |
| 4 | F1.4 | Progression builder | F1.1, F1.3 | Delivers the main project outcome: arranging compatible chords into a progression. |
| 5 | F1.5 | Interactive piano interface | F1.1 | Adds an alternate note-input method after the main chord-selection workflow is stable. |
| 6 | F1.6 | Chord audio playback | F1.1, F1.5 | Reuses the piano’s selected-note model and introduces the shared browser audio service. |
| 7 | F1.7 | Progression audio playback | F1.4, F1.6 | Builds on the completed progression model and chord playback service. |

## Dependency map

| Feature | Blocks | Dependency reason |
| --- | --- | --- |
| F1.1 Responsive foundation and validation | F1.2, F1.3, F1.4, F1.5, F1.6, F1.7 | Provides responsive layout, shared errors, validation, focus handling, and status patterns. |
| F1.2 User authentication | None in the current MVP | Required for the project minimum, but no saved-data feature is currently in scope. |
| F1.3 Key, scale, and chord explorer | F1.4 | Supplies the valid chord choices used to build a progression. |
| F1.4 Progression builder | F1.7 | Supplies the ordered progression and timing data for progression playback. |
| F1.5 Interactive piano interface | F1.6 | Supplies selected-note input for single-chord playback. |
| F1.6 Chord audio playback | F1.7 | Supplies the voice lifecycle and audio scheduling used by progression playback. |
| F1.7 Progression audio playback | None | Final extension in the current dependency chain. |

## First feature to implement

Implement **F1.1 Responsive Foundation and Validation** first. It is the only shared foundation feature and reduces rework across authentication, the chord explorer, the progression builder, and the piano/audio interfaces. It also directly satisfies the responsive-interface and basic error-handling requirements before feature-specific work begins.

After F1.1, the highest-value path is F1.3 → F1.4 because it delivers the core ChordLab idea. F1.2 can be implemented in parallel if the backend work is separated from the music UI.

## Risks that could delay multiple features

| Risk | Features affected | Mitigation |
| --- | --- | --- |
| Responsive layout decisions are delayed | F1.2–F1.7 | Decide the mobile layout, breakpoint, and panel stacking rules in F1.1. |
| Validation and error-state patterns are inconsistent | F1.2–F1.7 | Create shared form, status, and error components before feature work branches. |
| Authentication storage or session setup is unavailable | F1.2 and any future saved-data work | Confirm the course deployment database and session approach early; keep the current MVP music workflow local if necessary. |
| Music data and chord derivation rules are not defined | F1.3, F1.4, F1.5, F1.6, F1.7 | Limit the MVP to documented major and natural-minor triads with deterministic note/interval rules. |
| Browser audio behavior differs across devices | F1.6, F1.7 | Use a tested audio abstraction, initialize from user gestures, and provide a visual fallback/error state. |
| Piano interaction expands into MIDI or advanced voicing work | F1.5–F1.7 | Keep the MVP to clickable keyboard note selection; defer external MIDI and voicing discovery. |

## Scope guidance

For a two-week delivery, treat F1.1–F1.4 as the committed MVP. Treat F1.5–F1.7 as stretch features unless the core workflow is already complete and tested.

