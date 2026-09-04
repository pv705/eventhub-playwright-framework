import { expect, type Page } from '@playwright/test';

/** User-facing navigation and assertions for the authenticated bookings area. */
export class BookingsPage {
  public constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    const bookingsResponse = this.page.waitForResponse((response) => {
      const pathname = new URL(response.url()).pathname;
      return response.request().method() === 'GET' && /\/bookings$/.test(pathname);
    });

    await this.page.goto('/bookings');
    const response = await bookingsResponse;
    expect(response.ok(), `GET bookings failed with ${response.status()}`).toBeTruthy();
    await expect(this.page).toHaveURL(/\/bookings$/);
  }

  async openExpectingLoginRedirect(): Promise<void> {
    await this.page.goto('/bookings');
    await expect(this.page).toHaveURL((url) => url.pathname === '/login');
    await expect(this.page.getByRole('heading', { name: 'Sign in to EventHub', exact: true })).toBeVisible();
  }

  async expectBookingsAreaVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'My Bookings', exact: true })).toBeVisible();
  }

  async expectBookingVisible(eventTitle: string, quantity: number): Promise<void> {
    await expect(this.page.getByRole('heading', { name: eventTitle, exact: true })).toBeVisible();
    const ticketLabel = quantity === 1 ? 'ticket' : 'tickets';
    await expect(this.page.getByText(new RegExp(`\\b${quantity} ${ticketLabel}\\b`))).toBeVisible();
  }

  async cancelOnlyBooking(eventTitle: string): Promise<void> {
    const bookingHeading = this.page.getByRole('heading', { name: eventTitle, exact: true });
    const cancelButton = this.page.getByRole('button', { name: 'Cancel Booking', exact: true });
    await expect(bookingHeading).toBeVisible();
    await expect(cancelButton).toHaveCount(1);

    await cancelButton.click();
    const dialog = this.page.getByRole('dialog', { name: 'Cancel this booking?', exact: true });
    await expect(dialog).toBeVisible();

    const deleteResponse = this.page.waitForResponse((response) => {
      const pathname = new URL(response.url()).pathname;
      return response.request().method() === 'DELETE' && /\/bookings\/[^/]+$/.test(pathname);
    });
    await dialog.getByRole('button', { name: 'Yes, cancel it', exact: true }).click();
    const response = await deleteResponse;

    expect(response.ok(), `DELETE booking failed with ${response.status()}`).toBeTruthy();
    await expect(bookingHeading).toHaveCount(0);
    await expect(this.page.getByText('Booking cancelled successfully', { exact: true })).toBeVisible();
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'No bookings yet', exact: true })).toBeVisible();
  }
}
