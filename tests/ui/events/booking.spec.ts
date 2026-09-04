import { test, expect } from '../../../src/domain/fixtures/test.js';
import { EventDetailsPage } from '../../../src/ui/pages/events/EventDetailsPage.js';
import { BookingsPage } from '../../../src/ui/pages/bookings/BookingsPage.js';
import type { EventRecord } from '../../../src/core/types/domain.js';

function displayedEventDetails(event: EventRecord): {
  title: string;
  venue: string;
  eventDate: string;
  price: string | number;
  totalSeats: number;
  availableSeats: number;
} {
  const candidate = event as EventRecord & {
    venue?: unknown;
    eventDate?: unknown;
    price?: unknown;
  };
  if (
    typeof candidate.title !== 'string'
    || typeof candidate.venue !== 'string'
    || typeof candidate.eventDate !== 'string'
    || (typeof candidate.price !== 'string' && typeof candidate.price !== 'number')
    || typeof candidate.totalSeats !== 'number'
    || typeof candidate.availableSeats !== 'number'
  ) {
    throw new Error('The owned event response did not include all display details.');
  }

  return {
    title: candidate.title,
    venue: candidate.venue,
    eventDate: candidate.eventDate,
    price: candidate.price,
    totalSeats: candidate.totalSeats,
    availableSeats: candidate.availableSeats,
  };
}

// Covers the user-visible happy path from an isolated event to booking confirmation.
test.describe('Booking UI', () => {
  test('books, verifies, and cancels one ticket for an isolated event @smoke', async ({ authenticatedPage, authenticatedCredentials, ownedEvent }) => {
    const event = displayedEventDetails(ownedEvent);

    const details = new EventDetailsPage(authenticatedPage);
    const bookings = new BookingsPage(authenticatedPage);

    // 1. Open the exact event created for this test.
    await details.open(ownedEvent.id);
    await details.expectEventDetails(event);

    // 2. Submit one ticket through the customer-facing booking form.
    await details.bookOneTicket(
      'Automation Customer',
      authenticatedCredentials.email,
      '+1 555 010 1234',
    );
    await details.expectBookingConfirmation();

    // 3. Follow the confirmation into My Bookings and verify the owned event.
    await details.openBookingsFromConfirmation();
    await bookings.expectBookingsAreaVisible();
    await bookings.expectBookingVisible(event.title, 1);

    // 4. Confirm cancellation and verify the booking disappears.
    await bookings.cancelOnlyBooking(event.title);
    await bookings.expectEmptyState();
    await expect(authenticatedPage).not.toHaveURL(/\/login$/);
  });

  test('prevents blank and malformed booking form submissions @regression', async ({ authenticatedPage, authenticatedCredentials, authenticatedApi, ownedEvent }) => {
    const details = new EventDetailsPage(authenticatedPage);

    // 1. Open the isolated event booking form.
    await details.open(ownedEvent.id);

    // 2. Verify all blank customer fields are rejected by their required constraints.
    await details.expectBlankBookingFieldsRejected();

    // 3. Verify a malformed unique email is rejected by the email constraint.
    const malformedEmail = authenticatedCredentials.email.replace('@', '');
    await details.expectMalformedEmailRejected(
      'Automation Customer',
      malformedEmail,
      '+1 555 010 1234',
    );

    // 4. Verify invalid form attempts did not create a booking.
    const bookings = await authenticatedApi.bookings.list();
    expect(bookings.some((booking) => booking.eventId === ownedEvent.id)).toBe(false);
  });
});
