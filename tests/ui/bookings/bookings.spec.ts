import { test, expect } from '../../../src/domain/fixtures/test.js';
import { BookingsPage } from '../../../src/ui/pages/bookings/BookingsPage.js';

// Verifies the bookings empty state with an isolated user who owns no bookings.
test.describe('Bookings UI', () => {
  test('shows an empty bookings state for a new authenticated user @regression', async ({ authenticatedPage }) => {
    const bookingsPage = new BookingsPage(authenticatedPage);

    // 1. Open My Bookings as the newly registered test user.
    await bookingsPage.open();
    await bookingsPage.expectBookingsAreaVisible();

    // 2. Verify that no unrelated booking leaked into this user's account.
    await bookingsPage.expectEmptyState();
    await expect(authenticatedPage).not.toHaveURL(/\/login$/);
  });

  test('redirects an unauthenticated visitor to login @regression', async ({ page }) => {
    const bookingsPage = new BookingsPage(page);

    // 1. Open the protected bookings route without an authenticated fixture.
    await bookingsPage.openExpectingLoginRedirect();

    // 2. Verify the visitor remains on the login destination.
    await expect(page).toHaveURL((url) => url.pathname === '/login');
  });
});
