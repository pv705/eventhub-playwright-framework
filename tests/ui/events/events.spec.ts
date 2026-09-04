import { test } from '../../../src/domain/fixtures/test.js';
import { EventsPage } from '../../../src/ui/pages/events/EventsPage.js';

// Verifies the authenticated event-discovery page and its visible event inventory.
test.describe('Event discovery UI', () => {
  test('discovers and opens the exact owned event @smoke', async ({ authenticatedPage, ownedEvent }) => {
    const eventsPage = new EventsPage(authenticatedPage);
    if (!ownedEvent.title) throw new Error('The owned event did not include a title.');

    // 1. Open the event discovery page after creating an isolated event through the API.
    await eventsPage.open();

    // 2. Verify the page contains the exact event owned by this test.
    await eventsPage.expectEventVisible(ownedEvent.title);

    // 3. Open the owned event and verify navigation to its exact details route.
    await eventsPage.openEvent(ownedEvent.title, ownedEvent.id);
  });
});
