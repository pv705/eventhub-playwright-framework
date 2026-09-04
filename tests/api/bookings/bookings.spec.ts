import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';

// Exercises the complete booking API lifecycle with owned data.
test.describe('Bookings API', () => {
  test('creates, persists, and cancels an isolated booking @smoke', async ({ authenticatedApi, ownedEvent }) => {
    const input = bookingInput(ownedEvent.id, ownedEvent.id, 2);

    // 1. Record the event inventory before creating the booking.
    const eventBeforeBooking = await authenticatedApi.events.get(ownedEvent.id);
    if (typeof eventBeforeBooking.availableSeats !== 'number') {
      throw new Error('The event response did not include numeric availableSeats.');
    }

    // 2. Create the booking and verify the complete submitted payload.
    const booking = await authenticatedApi.bookings.create(input);
    expect(booking.id).toBeTruthy();
    expect(booking).toEqual(expect.objectContaining({ ...input }));

    // 3. Verify the exact owned booking persisted and inventory decreased.
    const bookingsAfterCreate = await authenticatedApi.bookings.list();
    const listedBooking = bookingsAfterCreate.find((item) => item.id === booking.id);
    expect(listedBooking).toEqual(expect.objectContaining({ id: booking.id, ...input }));

    const eventAfterBooking = await authenticatedApi.events.get(ownedEvent.id);
    expect(eventAfterBooking.availableSeats).toBe(eventBeforeBooking.availableSeats - input.quantity);

    // 4. Cancel the booking and verify both removal and restored inventory.
    await authenticatedApi.bookings.delete(booking.id);
    const bookingsAfterCancellation = await authenticatedApi.bookings.list();
    expect(bookingsAfterCancellation.some((item) => item.id === booking.id)).toBe(false);

    const eventAfterCancellation = await authenticatedApi.events.get(ownedEvent.id);
    expect(eventAfterCancellation.availableSeats).toBe(eventBeforeBooking.availableSeats);
  });
});
