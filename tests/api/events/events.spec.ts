import { test, expect } from '../../../src/domain/fixtures/test.js';
import { uniqueEvent } from '../../../src/core/utils/data.js';

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

  test('persists updated event details when read again @regression', async ({ authenticatedApi, ownedEvent }) => {
    const updatedInput = {
      ...uniqueEvent(),
      title: `Persisted ${ownedEvent.id}`,
      totalSeats: 12,
    };

    await authenticatedApi.events.update(ownedEvent.id, updatedInput);
    const reread = await authenticatedApi.events.get(ownedEvent.id);

    expect(reread.id).toBe(ownedEvent.id);
    expect(reread.title).toBe(updatedInput.title);
    expect(reread.totalSeats).toBe(updatedInput.totalSeats);
  });

  test('does not expose an event after it is deleted @regression', async ({ authenticatedApi }) => {
    const event = await authenticatedApi.events.create(uniqueEvent());
    let deleted = false;

    try {
      await authenticatedApi.events.delete(event.id);
      deleted = true;
      await expect(authenticatedApi.events.get(event.id)).rejects.toThrow(/404|500/i);
    } finally {
      if (!deleted) await authenticatedApi.events.delete(event.id);
    }
  });
});
