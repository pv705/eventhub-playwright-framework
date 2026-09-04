import { test, expect } from '../../../src/domain/fixtures/test.js';
import { EventsPage } from '../../../src/ui/pages/events/EventsPage.js';

test.describe('Event discovery UI', () => {
  test('browses upcoming events after authentication @smoke', async ({ authenticatedPage }) => {
    const eventsPage = new EventsPage(authenticatedPage);
    await eventsPage.open();
    await eventsPage.expectEventsVisible();
    await expect(authenticatedPage.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  });
});
