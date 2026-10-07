# F12 — Save Rename and Revisit Progressions

> Implementation plan. Source: `WDD430_Project_Spec.docx` (Saving chord progressions and Progressions API).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F12 |
| **Section** | Persistence |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | blocked by another feature |
| **Depends on** | F3, F8 |
| **Unblocks** | None |

## 1. Problem Statement

Ideas are lost if the workspace is temporary. Authenticated persistence lets users save, rename, reopen, duplicate, and delete their progressions.

## 2. Goals

- Implement the specified progression CRUD flow.
- Enforce ownership and optimistic UI feedback.
- Provide a list and detail view for returning users.

## 3. Non-Goals

- Collaboration, sharing links, version history, and cloud audio files.

## 4. Personas & User Stories

- **As a songwriter**, I want to rename and revisit an idea later.

## 5. Functional Requirements

- **FR-1.** The API MUST support list, create, read, patch, delete, and duplicate operations.
- **FR-2.** Users MUST see only their own progression records.
- **FR-3.** The UI MUST prevent accidental deletion and show save failures.

## 6. Non-Functional Requirements

- **Security** — authorization MUST be checked on every progression operation.
- **Reliability** — writes SHOULD be idempotent where retries are possible.

## 7. Acceptance Criteria

- **AC-1.** Given an authenticated workspace, when Save is pressed, then the progression appears in the user list.
- **AC-2.** Given an existing progression, when renamed, then the new title persists after refresh.
- **AC-3.** Given another user’s ID, when requested, then the API returns 403 or 404 without data.

## 8. Data Model

Implement the Progression model from the specification with user ID, title, context, ordered chords, and timestamps.

## 9. API Surface

Implement `GET/POST /api/progressions`, `GET/PATCH/DELETE /api/progressions/:progressionId`, and `POST /api/progressions/:progressionId/duplicate`.

## 10. UI / UX

Add save dialog, title editing, progression list, open, duplicate, delete confirmation, and empty state.

## 11. Dependencies & Sequencing

- Must ship after: F3 and F8.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Autosave or retries create duplicates | M | M | Use explicit save state and idempotency keys where needed. |

## 13. Rollout Plan

Migrate schema first, then enable authenticated save behind `chordlab.persistence`; rollback disables writes while retaining reads.

## 14. Test Plan

Unit-test validation; integration-test CRUD and ownership; E2E-test save/reopen/rename/duplicate/delete; accessibility-test dialogs.

## 15. Documentation & Training

Document saving, duplicate behavior, and deletion recovery expectations.

## 16. Open Questions

1. Is soft delete required for the first release?

## 17. References

- `WDD430_Project_Spec.docx`, Progression model and Progressions endpoints.
