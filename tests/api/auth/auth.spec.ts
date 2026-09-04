import { test, expect } from '../../../src/domain/fixtures/test.js';

// Covers successful authentication contracts with a unique user owned by each test.
test.describe('Authentication', () => {
  test('registers an isolated user and returns its identity @smoke', async ({ api, credentials }) => {
    // 1. Register a unique user through the public authentication API.
    const registration = await api.auth.register(credentials);

    // 2. Verify registration returns an authentication token and the registered identity.
    expect(registration.token ?? registration.accessToken, 'registration token').toBeTruthy();
    expect(registration.user, 'registered user').toMatchObject({ email: credentials.email });
  });

  test('logs in a registered user and returns the current identity @smoke', async ({ api, credentials }) => {
    // 1. Arrange a unique registered user for the login scenario.
    await api.auth.register(credentials);

    // 2. Log in with the credentials owned by this test.
    const login = await api.auth.login(credentials);
    const token = login.token ?? login.accessToken;

    // 3. Verify login returns the expected identity and a usable token.
    expect(token, 'login token').toBeTruthy();
    expect(login.user, 'logged-in user').toMatchObject({ email: credentials.email });
    if (!token) throw new Error('Login response did not contain an authentication token.');

    // 4. Use the login token to read the current authenticated user.
    const profile = await api.withToken(token).auth.me();

    // 5. Verify the current-user endpoint resolves to the same unique identity.
    expect(profile).toMatchObject({
      success: true,
      user: { email: credentials.email },
    });
  });
});
