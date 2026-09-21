---
name: quality-assurance
description: Write and validate fast, deterministic unit tests and applicable end-to-end regression tests for application changes, bug fixes, and new features. Use for QA work where behavior must be proven without skipping tests.
---

# Quality Assurance

Use this skill when changing application behavior, fixing a defect, or adding a feature. The goal is a trustworthy test suite: focused unit tests for logic, end-to-end tests for user-visible or cross-boundary behavior, and a final run in which every applicable test succeeds.

## Workflow

1. Inspect the repository's package metadata, existing test conventions, and available test commands before writing tests. Do not read secret files such as `.env`; use the application's existing configuration-loading path when tests need configuration.
2. Translate the change into observable behaviors and important failure/edge cases. Prefer tests that would fail for the original bug or an incorrect implementation.
3. Add unit tests for the smallest meaningful unit of business logic. Keep each test independent, deterministic, and quick: arrange its own state, act once on the behavior under test, and assert the externally observable result. Do not assert private fields, call order, incidental implementation details, or exact internal algorithms.
4. Name tests with the subject, condition, and expected outcome. Keep the Arrange / Act / Assert sections obvious and avoid multiple unrelated behaviors in one test.
5. Use realistic domain data, including boundary and invalid inputs. Add property-based tests when a stable invariant has many meaningful input combinations; otherwise choose a small, representative set. Mocks and fakes should isolate slow or external dependencies without replacing the behavior being proven.
6. Add E2E coverage when the change affects a user journey, routing, rendering, authentication/authorization, persistence, API integration, or another system boundary. Exercise the smallest realistic flow from the public interface and assert the user-visible outcome plus the key persisted or returned result. Reuse stable fixtures and test data setup, but do not share mutable state between tests.
7. If E2E is genuinely not applicable, record the reason in the test change or final report and cover the relevant boundary with the narrowest appropriate integration test. Never silently omit applicable E2E coverage.
8. Run the repository's complete required test commands, including all unit, integration, and applicable E2E suites. Do not add, retain, or rely on skipped, pending, focused-only, quarantined, or conditionally disabled tests. A test run is complete only when every test passes.
9. When a test fails, fix the test or implementation and rerun the full required set. Report the commands run and any environment limitation that prevented a required test from running; do not claim success from a partial run.

## Quality bar

- Tests are lean enough to understand quickly and cover behavior rather than coverage percentage.
- A test can run alone, in a different order, and repeatedly with the same result.
- Unit tests do not depend on network, wall clock, random uncontrolled data, filesystem leftovers, or another test's execution.
- E2E tests prove the feature through the same public path a user or client uses, while avoiding assertions about styling or framework internals unless those are the behavior under test.
- Test setup is explicit and cleanup is reliable; failures leave enough diagnostic context to locate the defect.
- The final report distinguishes unit, integration, and E2E results and states that no tests were skipped.

For the rationale behind the behavior-focused, AAA, deterministic, isolated, realistic-data, and property-based testing guidance, see [references/testing-principles.md](references/testing-principles.md).
