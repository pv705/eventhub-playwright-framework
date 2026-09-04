import { test, expect } from '../../../src/domain/fixtures/test.js';
import { uniqueUser } from '../../../src/core/utils/data.js';

test.describe('Authentication negative paths', () => {
  test('rejects invalid credentials @regression', async ({ api }) => {
    await expect(api.auth.login(uniqueUser())).rejects.toThrow(/400|401|Invalid/i);
  });

  test('rejects a password that violates registration rules @regression', async ({ api }) => {
    await expect(api.auth.register({ email: `invalid-${Date.now()}@example.test`, password: 'short' })).rejects.toThrow(/400|Validation|password/i);
  });
});
