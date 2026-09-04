import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';
import type { CreateBookingInput } from '../../../src/core/types/domain.js';

test.describe('Booking customer validation', () => {
  test('rejects blank required customer fields @regression', async ({ authenticatedApi, ownedEvent }) => {
    const validInput = bookingInput(ownedEvent.id, `required-${ownedEvent.id}`, 1);
    const requiredFields: Array<keyof Pick<CreateBookingInput, 'customerName' | 'customerEmail' | 'customerPhone'>> = [
      'customerName',
      'customerEmail',
      'customerPhone',
    ];

    // 1. Submit one otherwise valid payload for each blank required field.
    for (const field of requiredFields) {
      const request = authenticatedApi.bookings.create({ ...validInput, [field]: '' });

      // 2. Verify every blank field receives the documented validation response.
      await expect(request).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining('Validation failed'),
      });
    }
  });
});
