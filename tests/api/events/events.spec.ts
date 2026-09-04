import { test, expect } from '../../../src/domain/fixtures/test.js';

test.describe('Events API', () => {
  test('creates and reads an isolated event @smoke', async ({ authenticatedApi, ownedEvent }) => {
    const event = await authenticatedApi.events.get(ownedEvent.id);
    expect(event.id).toBe(ownedEvent.id);
  });

  test('updates an owned event @regression', async ({ authenticatedApi, ownedEvent }) => {
    const updated = await authenticatedApi.events.update(ownedEvent.id, {
      title: `${ownedEvent.title ?? 'Event'} updated`,
      description: 'Updated by an isolated automated test.',
      category: 'Technology',
      venue: 'Updated automation venue',
      city: 'Updated Test City',
      eventDate: '2030-01-01T10:00:00.000Z',
      price: 0,
      totalSeats: 10,
    });
    expect(updated.id).toBe(ownedEvent.id);
  });
});
