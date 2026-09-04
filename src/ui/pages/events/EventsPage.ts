import { expect, type Page } from '@playwright/test';

export class EventsPage {
  public constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/events');
    await expect(this.page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  }

  eventCard(name: string) {
    return this.page.getByRole('article').filter({ hasText: name });
  }

  async expectEventsVisible(): Promise<void> {
    await expect(this.page.getByRole('article').first()).toBeVisible();
  }
}
