import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';
import { uniqueEvent } from '../../../src/core/utils/data.js';

test.describe('Booking event validation', () => {
  test('rejects a booking for an event that no longer exists @regression', async ({ authenticatedApi, ownedEvent }) => {
    // 1. Create and delete a second owned event to obtain a valid but missing ID.
    const deletedEvent = await authenticatedApi.events.create(uniqueEvent());
    await authenticatedApi.events.delete(deletedEvent.id);

    // 2. Attempt a booking against that missing event.
    const request = authenticatedApi.bookings.create(
      bookingInput(deletedEvent.id, `missing-event-${ownedEvent.id}`, 1),
    );

    // 3. Verify the API reports the missing event precisely.
    await expect(request).rejects.toMatchObject({
      status: 404,
      message: expect.stringContaining(`Event with id ${deletedEvent.id} not found`),
    });
  });
});
