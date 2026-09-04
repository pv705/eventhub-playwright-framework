import { test, expect } from '../../src/domain/fixtures/test.js';

// Confirms that public diagnostics remain reachable without authentication.
test.describe('Public API', () => {
  test('reports service health @smoke', async ({ api }) => {
    // 1. Request the service health diagnostics without authentication.
    const health = await api.public.health();

    // 2. Verify the complete healthy-service contract and timestamp format.
    expect(health).toStrictEqual({
      status: 'ok',
      timestamp: expect.any(String),
      dbStatus: 'connected',
    });
    expect(health.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  test('exposes public configuration @regression', async ({ api }) => {
    // 1. Request the public feature configuration without authentication.
    const configuration = await api.public.config();

    // 2. Verify the complete deployed feature-switch contract.
    expect(configuration).toStrictEqual({ showExploreLinks: false });
  });
});
