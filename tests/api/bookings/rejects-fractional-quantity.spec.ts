import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Booking quantity validation', () => {
  test('rejects a fractional ticket quantity @regression', async ({ authenticatedApi, ownedEvent }) => {
    // 1. Submit a positive quantity that is not a whole ticket.
    const request = authenticatedApi.bookings.create(
      bookingInput(ownedEvent.id, `fractional-${ownedEvent.id}`, 1.5),
    );

    // 2. Verify the API reports a precise validation failure.
    await expect(request).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('Validation failed'),
    });
  });
});
