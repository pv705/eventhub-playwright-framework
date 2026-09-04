import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Missing booking reads', () => {
  test('returns not found by ID and reference after cancellation @regression', async ({ authenticatedApi, ownedEvent }) => {
    // 1. Create and cancel an isolated booking to obtain valid missing identifiers.
    const booking = await authenticatedApi.bookings.create(
      bookingInput(ownedEvent.id, `missing-read-${ownedEvent.id}`, 1),
    );
    if (!booking.reference) throw new Error('The booking response did not include a reference.');
    await authenticatedApi.bookings.delete(booking.id);

    // 2. Verify the ID lookup reports the cancelled booking as missing.
    await expect(authenticatedApi.bookings.get(booking.id)).rejects.toMatchObject({
      status: 404,
      message: expect.stringContaining(`Booking with id ${booking.id} not found`),
    });

    // 3. Verify the reference lookup reports the same booking as missing.
    await expect(authenticatedApi.bookings.getByReference(booking.reference)).rejects.toMatchObject({
      status: 404,
      message: expect.stringContaining(`Booking with reference \\"${booking.reference}\\" not found`),
    });
  });
});
