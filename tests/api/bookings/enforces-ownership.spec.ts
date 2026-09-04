import { test, expect } from '../../../src/domain/fixtures/test.js';
import { bookingInput } from '../../../src/core/utils/booking-data.js';
import { uniqueUser } from '../../../src/core/utils/data.js';

test.describe('Booking ownership', () => {
  test('hides and protects a booking from another authenticated user @regression', async ({ api, authenticatedApi, ownedEvent }) => {
    // 1. Create a booking owned by the primary isolated user.
    const booking = await authenticatedApi.bookings.create(
      bookingInput(ownedEvent.id, `owner-${ownedEvent.id}`, 1),
    );
    if (!booking.reference) throw new Error('The booking response did not include a reference.');

    // 2. Register a second isolated user and construct its authenticated client.
    const otherUserAuth = await api.auth.register(uniqueUser());
    const otherUserToken = otherUserAuth.token ?? otherUserAuth.accessToken;
    if (!otherUserToken) throw new Error('Second-user registration did not return an authentication token.');
    const otherUserApi = api.withToken(otherUserToken);

    // 3. Verify the second user's list does not expose the owner's booking.
    const otherUserBookings = await otherUserApi.bookings.list();
    expect(otherUserBookings.some((item) => item.id === booking.id)).toBe(false);

    // 4. Verify both direct reads reject the authenticated non-owner precisely.
    await expect(otherUserApi.bookings.get(booking.id)).rejects.toMatchObject({
      status: 403,
      message: expect.stringContaining('You are not authorized to view this booking'),
    });
    await expect(otherUserApi.bookings.getByReference(booking.reference)).rejects.toMatchObject({
      status: 403,
      message: expect.stringContaining('You do not own this booking'),
    });

    // 5. Verify cross-user cancellation is hidden as a missing resource.
    await expect(otherUserApi.bookings.delete(booking.id)).rejects.toMatchObject({
      status: 404,
      message: expect.stringContaining('not found'),
    });

    // 6. Verify the owner's direct read still returns the intact booking.
    const ownerBooking = await authenticatedApi.bookings.get(booking.id);
    expect(ownerBooking).toEqual(expect.objectContaining({ id: booking.id, reference: booking.reference }));
  });
});
