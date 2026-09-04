import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Booking quantity validation', () => {
  test('rejects zero and negative quantities @regression', async ({ authenticatedApi, ownedEvent }) => {
    // 1. Submit each non-positive boundary with otherwise valid owned data.
    for (const quantity of [0, -1]) {
      const request = authenticatedApi.bookings.create(
        bookingInput(ownedEvent.id, `non-positive-${quantity}-${ownedEvent.id}`, quantity),
      );

      // 2. Verify the API reports a precise validation failure.
      await expect(request).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining('Validation failed'),
      });
    }
  });
});
