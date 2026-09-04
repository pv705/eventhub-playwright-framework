import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Repeated booking submissions', () => {
  test('persists repeated submissions as distinct bookings @regression', async ({ authenticatedApi, ownedEvent }) => {
    const input = bookingInput(ownedEvent.id, `duplicate-${ownedEvent.id}`, 1);

    // 1. Submit the same owned booking payload twice.
    const firstBooking = await authenticatedApi.bookings.create(input);
    const secondBooking = await authenticatedApi.bookings.create(input);
    expect(secondBooking.id).not.toBe(firstBooking.id);

    // 2. Verify both independently created bookings persisted.
    const bookings = await authenticatedApi.bookings.list();
    expect(bookings.some((item) => item.id === firstBooking.id)).toBe(true);
    expect(bookings.some((item) => item.id === secondBooking.id)).toBe(true);
  });
});
