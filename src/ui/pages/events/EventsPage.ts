import { expect, type Page } from '@playwright/test';

/** Event discovery operations built on accessible, user-visible locators. */
export class EventsPage {
  public constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/events');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  }

  eventCard(name: string) {
    // Scope matching text to semantic event cards to avoid unrelated page content.
    return this.page.getByRole('article').filter({ hasText: name });
  }

  async expectEventVisible(name: string): Promise<void> {
    await expect(this.eventCard(name)).toBeVisible();
  }

  async openEvent(name: string, id: string): Promise<void> {
    await this.eventCard(name).getByRole('link', { name, exact: true }).click();
    await expect(this.page).toHaveURL(`/events/${encodeURIComponent(id)}`);
  }
}
