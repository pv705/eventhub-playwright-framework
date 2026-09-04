import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Booking authentication', () => {
  test('rejects unauthenticated booking operations @regression', async ({ api, authenticatedApi, ownedEvent }) => {
    // 1. Create one owned booking to provide a real cancellation target.
    const input = bookingInput(ownedEvent.id, `authentication-${ownedEvent.id}`, 1);
    const booking = await authenticatedApi.bookings.create(input);
    if (!booking.reference) throw new Error('The booking response did not include a reference.');
    const bookingReference = booking.reference;

    // 2. Verify every booking operation rejects a request without a token.
    const unauthenticatedOperations = [
      () => api.bookings.list(),
      () => api.bookings.create(input),
      () => api.bookings.get(booking.id),
      () => api.bookings.getByReference(bookingReference),
      () => api.bookings.delete(booking.id),
    ];
    for (const operation of unauthenticatedOperations) {
      await expect(operation()).rejects.toMatchObject({
        status: 401,
        message: expect.stringContaining('Unauthorized'),
      });
    }

    // 3. Verify the rejected cancellation did not remove the owned booking.
    const ownerBookings = await authenticatedApi.bookings.list();
    expect(ownerBookings.some((item) => item.id === booking.id)).toBe(true);
  });
});
