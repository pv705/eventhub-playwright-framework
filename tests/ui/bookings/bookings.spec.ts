import { test, expect } from '../../../src/domain/fixtures/test.js';
import { BookingsPage } from '../../../src/ui/pages/bookings/BookingsPage.js';

test.describe('Bookings UI', () => {
  test('opens the authenticated bookings area @regression', async ({ authenticatedPage }) => {
    const bookingsPage = new BookingsPage(authenticatedPage);
    await bookingsPage.open();
    await bookingsPage.expectBookingsAreaVisible();
    await expect(authenticatedPage).not.toHaveURL(/\/login$/);
  });
});
