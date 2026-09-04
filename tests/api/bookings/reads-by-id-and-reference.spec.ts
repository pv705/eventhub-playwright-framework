import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Booking reads', () => {
  test('returns an owned booking by ID and reference @regression', async ({ authenticatedApi, ownedEvent }) => {
    const input = bookingInput(ownedEvent.id, `read-${ownedEvent.id}`, 1);

    // 1. Create one isolated booking and require its normalized reference.
    const booking = await authenticatedApi.bookings.create(input);
    if (!booking.reference) throw new Error('The booking response did not include a reference.');

    // 2. Read the same owned booking through both documented lookup routes.
    const [bookingById, bookingByReference] = await Promise.all([
      authenticatedApi.bookings.get(booking.id),
      authenticatedApi.bookings.getByReference(booking.reference),
    ]);

    // 3. Verify both reads return the exact booking and submitted customer data.
    const expectedBooking = { id: booking.id, reference: booking.reference, ...input };
    expect(bookingById).toEqual(expect.objectContaining(expectedBooking));
    expect(bookingByReference).toEqual(expect.objectContaining(expectedBooking));
  });
});
