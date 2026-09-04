import { expect, type Page } from '@playwright/test';

export class BookingsPage {
  public constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/bookings');
    await expect(this.page).toHaveURL(/\/bookings$/);
  }

  async expectBookingsAreaVisible(): Promise<void> {
    await expect(this.page.getByRole('main')).toBeVisible();
  }
}
