import { test, expect } from '../../../src/domain/fixtures/test.js';
import { uniqueSuffix } from '../../../src/core/utils/data.js';

// Verifies that only a safe event read is recovered after an unauthorized response.
test.describe('Unauthorized authentication recovery', () => {
  test('re-authenticates after a 401 for a safe read @regression', async ({ api, credentials, ownedEvent }) => {
    // 1. Arrange an API client with a unique invalid bearer value that will receive a 401.
    const unauthorizedApi = api.withToken(`invalid-${uniqueSuffix()}`);

    // 2. Read the owned event through the bounded authentication-recovery helper.
    const event = await unauthorizedApi.getEventWithRecovery(ownedEvent.id, credentials);

    // 3. Verify the single safe retry returns the requested owned event.
    expect(event.id).toBe(ownedEvent.id);
  });
});
