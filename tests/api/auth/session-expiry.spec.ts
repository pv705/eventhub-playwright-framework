import { test, expect } from '../../../src/domain/fixtures/test.js';

test.describe('Authentication recovery', () => {
  test('re-authenticates after an expired session for a safe read @regression', async ({ api, credentials, ownedEvent }) => {
    const expiredApi = api.withToken('expired-token');
    const event = await expiredApi.getEventWithRecovery(ownedEvent.id, credentials);
    expect(event.id).toBe(ownedEvent.id);
  });
});
