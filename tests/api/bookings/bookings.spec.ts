import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';
import type { BookingRecord } from '../../../src/core/types/domain.js';

test.describe('Bookings API', () => {
  test('creates and cancels an isolated booking @smoke', async ({ authenticatedApi, ownedEvent }) => {
    const booking = await authenticatedApi.bookings.create(bookingInput(ownedEvent.id, ownedEvent.id, 1));
    expect(booking.id).toBeTruthy();
    await authenticatedApi.bookings.delete(booking.id);
  });

  test('rejects a non-positive booking quantity @regression', async ({ authenticatedApi, ownedEvent }) => {
    await expect(authenticatedApi.bookings.create(bookingInput(ownedEvent.id, `invalid-${ownedEvent.id}`, 0))).rejects.toThrow();
  });

  test('rejects a booking above the available seat boundary @regression', async ({ authenticatedApi, ownedEvent }) => {
    await expect(authenticatedApi.bookings.create(bookingInput(ownedEvent.id, `overflow-${ownedEvent.id}`, 11))).rejects.toThrow();
  });

  test('handles a repeated booking submission for the same customer and event @regression', async ({ authenticatedApi, ownedEvent }) => {
    const input = bookingInput(ownedEvent.id, `duplicate-${ownedEvent.id}`, 1);
    const firstBooking = await authenticatedApi.bookings.create(input);
    let secondBooking: BookingRecord | undefined;
    try {
      secondBooking = await authenticatedApi.bookings.create(input);
      expect(secondBooking.id).not.toBe(firstBooking.id);
    } finally {
      await authenticatedApi.bookings.delete(firstBooking.id);
      if (secondBooking) await authenticatedApi.bookings.delete(secondBooking.id);
    }
  });

  test('returns a newly created booking in the authenticated booking list @regression', async ({ authenticatedApi, ownedEvent }) => {
    const input = bookingInput(ownedEvent.id, `listed-${ownedEvent.id}`, 2);
    const booking = await authenticatedApi.bookings.create(input);

    try {
      const bookings = await authenticatedApi.bookings.list();
      const listedBooking = bookings.find((item) => item.id === booking.id);

      expect(listedBooking).toMatchObject({
        id: booking.id,
        eventId: ownedEvent.id,
        customerEmail: input.customerEmail,
      });
    } finally {
      await authenticatedApi.bookings.delete(booking.id);
    }
  });
});
