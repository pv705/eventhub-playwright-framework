import { test, expect } from '../../../src/domain/fixtures/test.js';
import { uniqueEvent } from '../../../src/core/utils/data.js';

// Exercises the authenticated event lifecycle with test-owned data.
test.describe('Events API', () => {
  test('creates and persists exact event details @smoke', async ({ authenticatedApi }) => {
    // 1. Create a unique event through the authenticated events API.
    const input = uniqueEvent();
    const created = await authenticatedApi.events.create(input);
    let assertionsPassed = false;

    try {
      // 2. Verify the creation response represents the submitted event.
      expect(created).toMatchObject({ id: expect.any(String), ...input, price: String(input.price) });

      // 3. Read the event back and verify every submitted field persisted.
      const reread = await authenticatedApi.events.get(created.id);
      expect(reread).toMatchObject({ id: created.id, ...input, price: String(input.price) });
      assertionsPassed = true;
    } finally {
      // 4. Remove only this test's event after successful verification.
      if (assertionsPassed) await authenticatedApi.events.delete(created.id);
    }
  });

  test('lists the exact event owned by this test @regression', async ({ authenticatedApi, ownedEvent }) => {
    // 1. Request the authenticated event collection.
    const events = await authenticatedApi.events.list();

    // 2. Verify the collection contains this test's isolated event.
    expect(events).toContainEqual(expect.objectContaining({
      id: ownedEvent.id,
      title: ownedEvent.title,
      totalSeats: ownedEvent.totalSeats,
    }));
  });

  test('updates and persists an owned event @regression', async ({ authenticatedApi, ownedEvent }) => {
    // 1. Build the complete replacement required by the update endpoint.
    const updatedInput = {
      ...uniqueEvent(),
      title: `${ownedEvent.title ?? 'Event'} updated`,
      description: 'Updated by an isolated automated test.',
      venue: 'Updated automation venue',
      city: 'Updated Test City',
      totalSeats: 12,
    };

    // 2. Replace the event and verify the update response.
    const updated = await authenticatedApi.events.update(ownedEvent.id, updatedInput);
    expect(updated).toMatchObject({ id: ownedEvent.id, ...updatedInput, price: String(updatedInput.price) });

    // 3. Read the event again and verify the changes persisted.
    const reread = await authenticatedApi.events.get(ownedEvent.id);
    expect(reread).toMatchObject({ id: ownedEvent.id, ...updatedInput, price: String(updatedInput.price) });
  });

  test('returns not found after deleting an owned event @regression', async ({ authenticatedApi }) => {
    // 1. Create an event whose deletion is owned by this test.
    const event = await authenticatedApi.events.create(uniqueEvent());

    // 2. Delete the event through the authenticated events API without replaying the mutation.
    await authenticatedApi.events.delete(event.id);

    // 3. Verify the deleted event has the exact missing-resource status.
    await expect(authenticatedApi.events.get(event.id)).rejects.toMatchObject({ status: 404 });
  });
});
