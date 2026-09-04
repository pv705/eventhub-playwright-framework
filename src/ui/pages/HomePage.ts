import { expect, type Page } from '@playwright/test';

export class HomePage {
  public constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Discover and Book Amazing Events' })).toBeVisible();
  }

  browseEvents() {
    return this.page.getByRole('link', { name: 'Browse Events →' });
  }
}
