import { test, expect } from '../../../src/domain/fixtures/test.js';

test.describe('Event access boundaries', () => {
  test('rejects an unauthenticated event read @regression', async ({ api, ownedEvent }) => {
    await expect(api.withToken('invalid-token').events.get(ownedEvent.id)).rejects.toThrow(/401|403/i);
  });

  test('rejects a missing event resource @regression', async ({ authenticatedApi }) => {
    await expect(authenticatedApi.events.get('missing-event-id')).rejects.toThrow(/404|500/i);
  });
});
