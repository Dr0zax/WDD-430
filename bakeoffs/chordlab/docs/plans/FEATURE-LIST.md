# ChordLab Feature List

Source: `WDD430_Project_Spec.docx`. Each item is scoped to no more than one week of implementation.

| # | Feature | Classification | Depends on |
|---:|---|---|---|
| F1 | Project foundation and design system | infrastructure/supporting | — |
| F2 | Music theory domain engine | infrastructure/supporting | F1 |
| F3 | User accounts and authentication | independent | F1 |
| F4 | Key and scale selection | blocked by another feature | F2 |
| F5 | Diatonic chord discovery | blocked by another feature | F2, F4 |
| F6 | Chord details and instrument voicings | blocked by another feature | F2 |
| F7 | Piano-style chord input | blocked by another feature | F2 |
| F8 | Progression workspace | blocked by another feature | F5, F7 |
| F9 | Chord and progression audio playback | blocked by another feature | F2, F8 |
| F10 | Next-chord suggestions | blocked by another feature | F2, F5 |
| F11 | Genre-aware progression generation | blocked by another feature | F2, F4, F10 |
| F12 | Save, rename, and revisit progressions | blocked by another feature | F3, F8 |
| F13 | MIDI controller input | blocked by another feature | F7 |

