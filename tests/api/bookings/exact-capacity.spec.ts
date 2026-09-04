import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

test.describe('Booking inventory boundaries', () => {
  test('books the exact capacity and rejects one additional ticket @regression', async ({ authenticatedApi, ownedEvent }) => {
    const currentEvent = await authenticatedApi.events.get(ownedEvent.id);
    if (typeof currentEvent.availableSeats !== 'number') {
      throw new Error('The event response did not include numeric availableSeats.');
    }

    // 1. Book every currently available seat for the isolated event.
    const fullCapacityBooking = await authenticatedApi.bookings.create(
      bookingInput(ownedEvent.id, `capacity-${ownedEvent.id}`, currentEvent.availableSeats),
    );
    const soldOutEvent = await authenticatedApi.events.get(ownedEvent.id);
    expect(soldOutEvent.availableSeats).toBe(0);

    // 2. Attempt one more ticket and verify insufficient inventory is rejected.
    await expect(
      authenticatedApi.bookings.create(bookingInput(ownedEvent.id, `sold-out-${ownedEvent.id}`, 1)),
    ).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('Only 0 seat(s) available, but 1 requested'),
    });

    // 3. Cancel the capacity booking and verify all seats are released.
    await authenticatedApi.bookings.delete(fullCapacityBooking.id);
    const restoredEvent = await authenticatedApi.events.get(ownedEvent.id);
    expect(restoredEvent.availableSeats).toBe(currentEvent.availableSeats);
  });
});
