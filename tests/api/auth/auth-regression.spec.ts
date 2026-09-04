import { test, expect } from '../../../src/domain/fixtures/test.js';

// Covers authentication failures that must remain explicit and user-actionable.
test.describe('Authentication negative paths', () => {
  test('rejects invalid credentials @regression', async ({ api, credentials }) => {
    // 1. Attempt login with unique credentials that have never been registered.
    const login = api.auth.login(credentials);

    // 2. Verify the API returns its confirmed invalid-credentials contract.
    await expect(login).rejects.toThrow(/400.*Invalid email or password/i);
  });

  test('rejects a password that violates registration rules @regression', async ({ api, credentials }) => {
    // 1. Attempt registration with a unique email and a password below the minimum length.
    const registration = api.auth.register({ ...credentials, password: 'short' });

    // 2. Verify the API identifies the password validation failure.
    await expect(registration).rejects.toThrow(/400.*Validation failed.*Password must be at least 6 characters/i);
  });

  test('rejects a duplicate email registration @regression', async ({ api, credentials }) => {
    // 1. Register the unique user for the first time.
    await api.auth.register(credentials);

    // 2. Attempt to register the same email again.
    const duplicateRegistration = api.auth.register(credentials);

    // 3. Verify the API returns its confirmed duplicate-email contract.
    await expect(duplicateRegistration).rejects.toThrow(/400.*Email already registered/i);
  });

  test('rejects an unauthenticated current-user request @regression', async ({ api }) => {
    // 1. Request the current user without supplying an authentication token.
    const currentUser = api.auth.me();

    // 2. Verify the API returns its confirmed unauthorized contract.
    await expect(currentUser).rejects.toThrow(/401.*Unauthorized/i);
  });
});
