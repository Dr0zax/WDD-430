# Testing principles

This skill is grounded in the five principles described by One Beyond in [The 5 principles of Unit Testing](https://dev.to/one-beyond/the-5-principles-of-unit-testing-1p5f):

1. Keep tests lean and accurate. Test important business behavior and principal edge cases rather than chasing a coverage number.
2. Test behavior, not implementation. Assertions should remain valid after an internal refactor that preserves the contract.
3. Use diagnostic names and the Arrange / Act / Assert structure. A reader should see what is tested, the context, and the expected outcome.
4. Make tests deterministic and isolated. They should be order-independent and free from shared mutable state.
5. Prefer realistic data; use property-based testing when broad input combinations express a useful invariant.

The article also notes that difficult-to-test logic can signal a component that should be split into smaller, testable units. Apply that as a design signal, not as a reason to rewrite unrelated production code.
