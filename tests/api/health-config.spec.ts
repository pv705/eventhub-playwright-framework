import { test, expect } from '../../src/domain/fixtures/test.js';

test.describe('Public API', () => {
  test('reports service health @smoke', async ({ api }) => {
    const health = await api.public.health();
    expect(health).toBeTruthy();
  });

  test('exposes public configuration @regression', async ({ api }) => {
    const configuration = await api.public.config();
    expect(configuration).toBeTruthy();
  });
});
