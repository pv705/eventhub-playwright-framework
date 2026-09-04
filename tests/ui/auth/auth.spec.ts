import { test, expect } from '../../../src/domain/fixtures/test.js';
import { LoginPage } from '../../../src/ui/pages/auth/LoginPage.js';
import { RegisterPage } from '../../../src/ui/pages/auth/RegisterPage.js';
import { BookingsPage } from '../../../src/ui/pages/bookings/BookingsPage.js';

const passwordMismatchMessage = 'Passwords do not match';
const weakPasswordMessage = 'Password does not meet the requirements below';

// Covers the critical authentication entry points without sharing user state.
test.describe('Authentication', () => {
  test('signs in a registered user through the UI @smoke', async ({ page, credentials, authenticatedApi: _authenticatedApi }) => {
    // 1. Arrange registration through the API without repeating UI setup.
    void _authenticatedApi;

    // 2. Open the login page and submit this test's unique credentials.
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.signInAs(credentials.email, credentials.password);

    // 3. Verify successful login reaches the confirmed home destination.
    await loginPage.expectSignInSucceeded();

    // 4. Verify the new session can reach an authenticated area without redirection.
    const bookingsPage = new BookingsPage(page);
    await bookingsPage.open();
    await bookingsPage.expectBookingsAreaVisible();
  });

  test('registers an isolated user through the UI @smoke', async ({ page, credentials }) => {
    // 1. Open the registration page for a unique, unregistered user.
    const registerPage = new RegisterPage(page);
    await registerPage.open();

    // 2. Submit the unique credentials through the registration form.
    await registerPage.register(credentials.email, credentials.password);

    // 3. Verify successful registration reaches the confirmed home destination.
    await registerPage.expectRegistrationSucceeded();

    // 4. Open the authenticated bookings area using the session created by registration.
    const bookingsPage = new BookingsPage(page);
    await bookingsPage.open();
    await bookingsPage.expectBookingsAreaVisible();

    // 5. Verify the authenticated My Bookings heading is rendered.
    await expect(page.getByRole('heading', { name: 'My Bookings', exact: true })).toBeVisible();
  });

  test('keeps the user signed out when credentials are invalid @regression', async ({ page, credentials }) => {
    // 1. Open the login page for credentials that have never been registered.
    const loginPage = new LoginPage(page);
    await loginPage.open();

    // 2. Submit the unique invalid credentials through the login form.
    const status = await loginPage.signInExpectingFailure(credentials.email, credentials.password);

    // 3. Verify the login request returns the confirmed client-error status.
    expect(status).toBe(400);

    // 4. Verify the user remains on login and sees the precise authentication error.
    await loginPage.expectInvalidCredentialsError();
  });

  test('shows a validation error when registration passwords do not match @regression', async ({ page, credentials }) => {
    // 1. Open registration for a unique, unregistered user.
    const registerPage = new RegisterPage(page);
    await registerPage.open();

    // 2. Submit a valid password with a deliberately different confirmation.
    await registerPage.submitForValidation(credentials.email, credentials.password, `${credentials.password}X`);

    // 3. Verify registration remains blocked with the confirmed mismatch message.
    await registerPage.expectValidationError(passwordMismatchMessage);
  });

  test('shows a validation error when the registration password is weak @regression', async ({ page, credentials }) => {
    // 1. Open registration for a unique, unregistered user.
    const registerPage = new RegisterPage(page);
    await registerPage.open();

    // 2. Submit a password that violates the visible registration requirements.
    await registerPage.submitForValidation(credentials.email, 'short', 'short');

    // 3. Verify registration remains blocked with the confirmed requirements message.
    await registerPage.expectValidationError(weakPasswordMessage);
  });
});
