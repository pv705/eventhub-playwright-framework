import { test as base, expect } from '@playwright/test';
import { environment } from '../../core/config/env.js';
import { EventHubApi } from '../api/eventhub.api.js';
import { uniqueEvent, uniqueUser } from '../../core/utils/data.js';
import type { EventRecord, UserCredentials } from '../../core/types/domain.js';
import { LoginPage } from '../../ui/pages/auth/LoginPage.js';

/** Project fixtures that provide isolated users, authenticated clients, pages, and events. */
type Fixtures = {
  api: EventHubApi;
  credentials: UserCredentials;
  authenticatedApi: EventHubApi;
  ownedEvent: EventRecord;
  authenticatedPage: import('@playwright/test').Page;
  authenticatedCredentials: UserCredentials;
};

export const test = base.extend<Fixtures>({
  // Share Playwright's request context while keeping authentication opt-in.
  api: async ({ request }, use) => {
    const env = environment();
    await use(new EventHubApi(request, env.apiUrl));
  },
  credentials: async ({ request: _request }, use) => {
    // Depending on request preserves fixture scheduling without using the context directly.
    void _request;
    await use(uniqueUser());
  },
  authenticatedApi: async ({ api, credentials }, use) => {
    const auth = await api.auth.register(credentials);
    const token = auth.token ?? auth.accessToken;
    if (!token) throw new Error('Registration response did not contain an authentication token.');
    await use(api.withToken(token));
  },
  ownedEvent: async ({ authenticatedApi }, use, testInfo) => {
    const event = await authenticatedApi.events.create(uniqueEvent());
    try {
      await use(event);
    } finally {
      // Retain failed-test data for diagnosis; clean only resources owned by passing tests.
      if (testInfo.status === testInfo.expectedStatus) {
        const bookings = await authenticatedApi.bookings.list();
        for (const booking of bookings.filter((item) => item.eventId === event.id)) {
          await authenticatedApi.bookings.delete(booking.id);
        }
        await authenticatedApi.events.delete(event.id);
      } else {
        await testInfo.attach('owned-event.json', {
          body: Buffer.from(JSON.stringify({ id: event.id, title: event.title }, null, 2)),
          contentType: 'application/json',
        });
      }
    }
  },
  authenticatedPage: async ({ page, credentials, authenticatedApi: _authenticatedApi }, use) => {
    // Registration is completed by authenticatedApi before the generated user logs in.
    void _authenticatedApi;
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.signInAs(credentials.email, credentials.password);
    // A route change is the application-level signal that login has completed.
    await page.waitForURL((url) => url.pathname !== '/login', { waitUntil: 'domcontentloaded' });
    await use(page);
  },
  authenticatedCredentials: async ({ credentials }, use) => {
    await use(credentials);
  },
});

export { expect };
