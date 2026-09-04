import { expect, type Page } from '@playwright/test';

export class EventDetailsPage {
  private readonly fullName;
  private readonly email;
  private readonly phone;
  private readonly confirmBooking;

  public constructor(private readonly page: Page) {
    this.fullName = page.getByRole('textbox', { name: 'Full Name' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.phone = page.getByRole('textbox', { name: 'Phone Number' });
    this.confirmBooking = page.getByRole('button', { name: 'Confirm Booking' });
  }

  async open(eventId: string): Promise<void> {
    await this.page.goto(`/events/${encodeURIComponent(eventId)}`);
    await expect(this.confirmBooking).toBeVisible();
  }

  async bookOneTicket(name: string, email: string, phone: string): Promise<void> {
    await this.fullName.fill(name);
    await this.email.fill(email);
    await this.phone.fill(phone);
    await this.confirmBooking.click();
  }

  async expectBookingConfirmation(): Promise<void> {
    await expect(this.page.getByText(/booking confirmed|booking successful/i)).toBeVisible();
  }
}
