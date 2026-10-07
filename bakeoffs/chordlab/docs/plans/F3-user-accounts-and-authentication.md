# F3 — User Accounts and Authentication

> Implementation plan. Source: `WDD430_Project_Spec.docx` (User model and Auth endpoints).

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F3 |
| **Section** | Accounts |
| **Severity** | MAJOR |
| **Markets** | Web |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | ChordLab web team |
| **Classification** | independent |
| **Depends on** | F1 |
| **Unblocks** | F12 |

## 1. Problem Statement

Saved progressions need an owner and secure session lifecycle. Authentication gives users a safe way to return to their ideas without coupling account work to music exploration.

## 2. Goals

- Implement registration, login, logout, and current-user retrieval.
- Store the specified user fields and a system-theme preference.
- Protect user-owned resources with authorization checks.

## 3. Non-Goals

- Social login, email verification, password reset, and team accounts.

## 4. Personas & User Stories

- **As a songwriter**, I want to sign in so my ideas are available across sessions.
- **As a privacy-conscious user**, I want another user unable to read my progressions.

## 5. Functional Requirements

- **FR-1.** The API MUST expose `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`.
- **FR-2.** Passwords MUST never be stored or logged in plaintext.
- **FR-3.** Unauthorized requests MUST receive a consistent 401 response.

## 6. Non-Functional Requirements

- **Security** — secure session cookies or equivalent, rate-limited login, and authorization tests.
- **Privacy** — return only the minimum profile fields.

## 7. Acceptance Criteria

- **AC-1.** Given valid registration data, when submitted, then a user is created and no password is returned.
- **AC-2.** Given valid credentials, when login succeeds, then `/api/auth/me` returns the user.
- **AC-3.** Given a different user, when accessing a protected resource, then the request is denied.

## 8. Data Model

Implement the User model fields from the specification with a unique email and created timestamp.

## 9. API Surface

Auth routes above; define request validation and a standard user response schema.

## 10. UI / UX

Add sign-in, registration, signed-out, and session-expired states without blocking public exploration.

## 11. Dependencies & Sequencing

- Must ship after: F1.
- Must ship before: F12.

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Session handling leaks credentials | L | H | Use established auth primitives and security tests. |

## 13. Rollout Plan

Keep account UI available behind a feature flag; rollback disables writes while preserving public music features.

## 14. Test Plan

Unit-test validation and password handling; integration-test all auth routes, expiry, logout, and cross-user authorization.

## 15. Documentation & Training

Document account lifecycle, local test credentials, and security assumptions.

## 16. Open Questions

1. Which session strategy is approved for the deployment target?

## 17. References

- `WDD430_Project_Spec.docx`, User model and Auth endpoints.
