import { test, expect } from '../../../src/domain/fixtures/test.js';
import { isoDateFromNow, uniqueEvent, uniqueUser } from '../../../src/core/utils/data.js';

// Covers authentication, ownership, and validation boundaries for event operations.
test.describe('Event access boundaries', () => {
  test('rejects an unauthenticated event read @regression', async ({ api, ownedEvent }) => {
    // 1. Request an owned event without an authentication token.
    await expect(api.events.get(ownedEvent.id)).rejects.toMatchObject({ status: 401 });
  });

  test('rejects an unauthenticated event collection read @regression', async ({ api }) => {
    // 1. Request the event collection without an authentication token.
    await expect(api.events.list()).rejects.toMatchObject({ status: 401 });
  });

  test('rejects unauthenticated event creation @regression', async ({ api }) => {
    // 1. Attempt to create a valid event without an authentication token.
    await expect(api.events.create(uniqueEvent())).rejects.toMatchObject({ status: 401 });
  });

  test('rejects unauthenticated event updates and deletion @regression', async ({ api, ownedEvent }) => {
    // 1. Attempt to replace an owned event without an authentication token.
    await expect(api.events.update(ownedEvent.id, uniqueEvent())).rejects.toMatchObject({ status: 401 });

    // 2. Attempt to delete the same event without an authentication token.
    await expect(api.events.delete(ownedEvent.id)).rejects.toMatchObject({ status: 401 });
  });

  test('hides event mutations from a different authenticated user @regression', async ({ api, ownedEvent }) => {
    // 1. Register a separate user and create its authenticated client.
    const auth = await api.auth.register(uniqueUser());
    const token = auth.token ?? auth.accessToken;
    if (!token) throw new Error('A second registered user did not receive an authentication token.');
    const otherUserApi = api.withToken(token);

    // 2. Attempt to replace the first user's event as the second user.
    await expect(otherUserApi.events.update(ownedEvent.id, uniqueEvent())).rejects.toMatchObject({ status: 404 });

    // 3. Attempt to delete the first user's event as the second user.
    await expect(otherUserApi.events.delete(ownedEvent.id)).rejects.toMatchObject({ status: 404 });
  });
});

const invalidCreateScenarios = [
  { name: 'a blank title', input: () => ({ ...uniqueEvent(), title: '' }) },
  { name: 'a past date', input: () => ({ ...uniqueEvent(), eventDate: isoDateFromNow(-1) }) },
  { name: 'a negative price', input: () => ({ ...uniqueEvent(), price: -1 }) },
  { name: 'zero seats', input: () => ({ ...uniqueEvent(), totalSeats: 0 }) },
] as const;

test.describe('Event creation validation', () => {
  for (const scenario of invalidCreateScenarios) {
    test(`rejects ${scenario.name} @regression`, async ({ authenticatedApi }) => {
      // 1. Submit one invalid boundary while keeping the remaining event data valid.
      await expect(authenticatedApi.events.create(scenario.input())).rejects.toMatchObject({ status: 400 });
    });
  }
});

test.describe('Event update validation', () => {
  test('rejects a blank title without changing the owned event @regression', async ({ authenticatedApi }) => {
    // 1. Create an isolated event and retain its complete original input.
    const originalInput = uniqueEvent();
    const event = await authenticatedApi.events.create(originalInput);
    let assertionsPassed = false;

    try {
      // 2. Attempt a complete replacement with a blank required title.
      await expect(authenticatedApi.events.update(event.id, { ...originalInput, title: '' })).rejects.toMatchObject({ status: 400 });

      // 3. Verify the rejected update did not change any original event field.
      const reread = await authenticatedApi.events.get(event.id);
      expect(reread).toMatchObject({ id: event.id, ...originalInput, price: String(originalInput.price) });
      assertionsPassed = true;
    } finally {
      // 4. Remove only this test's event after every validation assertion passes.
      if (assertionsPassed) await authenticatedApi.events.delete(event.id);
    }
  });
});
