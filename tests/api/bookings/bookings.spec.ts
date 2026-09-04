import { test, expect } from '../../../src/domain/fixtures/test.js';

test.describe('Bookings API', () => {
  test('creates and cancels an isolated booking @smoke', async ({ authenticatedApi, ownedEvent }) => {
    const booking = await authenticatedApi.bookings.create({
      eventId: ownedEvent.id,
      quantity: 1,
      customerName: 'Automation Customer',
      customerEmail: `booking-${ownedEvent.id}@example.test`,
      customerPhone: '+1 555 010 1234',
    });
    expect(booking.id).toBeTruthy();
    await authenticatedApi.bookings.delete(booking.id);
  });

  test('rejects a non-positive booking quantity @regression', async ({ authenticatedApi, ownedEvent }) => {
    await expect(authenticatedApi.bookings.create({
      eventId: ownedEvent.id,
      quantity: 0,
      customerName: 'Automation Customer',
      customerEmail: `invalid-${ownedEvent.id}@example.test`,
      customerPhone: '+1 555 010 1234',
    })).rejects.toThrow();
  });
});
