import { test, expect } from '../../../src/domain/fixtures/test.js';
import { EventDetailsPage } from '../../../src/ui/pages/events/EventDetailsPage.js';

test.describe('Booking UI', () => {
  test('books one ticket for an isolated event @smoke', async ({ authenticatedPage, authenticatedCredentials, ownedEvent }) => {
    const details = new EventDetailsPage(authenticatedPage);
    await details.open(ownedEvent.id);
    await details.bookOneTicket(
      'Automation Customer',
      authenticatedCredentials.email,
      '+1 555 010 1234',
    );
    await details.expectBookingConfirmation();
    await expect(authenticatedPage).not.toHaveURL(/\/login$/);
  });
});
