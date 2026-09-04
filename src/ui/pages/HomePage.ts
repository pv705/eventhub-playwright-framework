import { expect, type Page } from '@playwright/test';

/** Root-route behavior for a visitor who has not authenticated. */
export class HomePage {
  public constructor(private readonly page: Page) {}

  async openUnauthenticated(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Sign in to EventHub', exact: true })).toBeVisible();
  }
}
