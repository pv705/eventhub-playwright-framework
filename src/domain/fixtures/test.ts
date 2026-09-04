import { test as base, expect } from '@playwright/test';
import { environment } from '../../core/config/env.js';
import { EventHubApi } from '../api/eventhub.api.js';
import { uniqueEvent, uniqueUser } from '../../core/utils/data.js';
import type { EventRecord, UserCredentials } from '../../core/types/domain.js';
import { LoginPage } from '../../ui/pages/auth/LoginPage.js';

type Fixtures = {
  api: EventHubApi;
  credentials: UserCredentials;
  authenticatedApi: EventHubApi;
  ownedEvent: EventRecord;
  authenticatedPage: import('@playwright/test').Page;
  authenticatedCredentials: UserCredentials;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const env = environment();
    await use(new EventHubApi(request, env.apiUrl));
  },
  credentials: async ({ request: _request }, use) => {
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
      if (testInfo.status === testInfo.expectedStatus) {
        const bookings = await authenticatedApi.bookings.list();
        for (const booking of bookings.filter((item) => item.eventId === event.id)) {
          await authenticatedApi.bookings.delete(booking.id);
        }
        await authenticatedApi.events.delete(event.id);
      }
    }
  },
  authenticatedPage: async ({ page, credentials, authenticatedApi: _authenticatedApi }, use) => {
    void _authenticatedApi;
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.signInAs(credentials.email, credentials.password);
    await page.waitForURL((url) => url.pathname !== '/login', { waitUntil: 'domcontentloaded' });
    await use(page);
  },
  authenticatedCredentials: async ({ credentials }, use) => {
    await use(credentials);
  },
});

export { expect };
