import { expect, type Page } from '@playwright/test';

type DisplayedEventDetails = {
  title: string;
  venue: string;
  eventDate: string;
  price: string | number;
  totalSeats: number;
  availableSeats: number;
};

/** Event-detail actions for opening an event and completing its booking form. */
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

  async expectEventDetails(event: DisplayedEventDetails): Promise<void> {
    const main = this.page.getByRole('main');
    const eventDate = new Date(event.eventDate);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(eventDate);
    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(eventDate);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(eventDate);
    const displayedDate = `${weekday}, ${day} ${month}`;

    await expect(this.page.getByRole('heading', { name: event.title, exact: true })).toBeVisible();
    await expect(this.page.getByText(event.venue, { exact: true })).toBeVisible();
    await expect(this.page.getByText(displayedDate, { exact: true })).toBeVisible();
    await expect(this.page.getByText(`${event.availableSeats} / ${event.totalSeats} seats`, { exact: true })).toBeVisible();
    await expect(main).toContainText(`$${event.price}`);
  }

  async bookOneTicket(name: string, email: string, phone: string): Promise<void> {
    await this.fullName.fill(name);
    await this.email.fill(email);
    await this.phone.fill(phone);
    await this.confirmBooking.click();
  }

  async expectBlankBookingFieldsRejected(): Promise<void> {
    await this.fullName.fill('');
    await this.email.fill('');
    await this.phone.fill('');
    await this.confirmBooking.click();

    for (const field of [this.fullName, this.email, this.phone]) {
      const validity = await field.evaluate((element: HTMLInputElement) => ({
        required: element.required,
        valid: element.validity.valid,
        valueMissing: element.validity.valueMissing,
      }));
      expect(validity).toEqual({ required: true, valid: false, valueMissing: true });
    }
    await expect(this.confirmBooking).toBeVisible();
  }

  async expectMalformedEmailRejected(name: string, invalidEmail: string, phone: string): Promise<void> {
    await this.fullName.fill(name);
    await this.email.fill(invalidEmail);
    await this.phone.fill(phone);
    await this.confirmBooking.click();

    const validity = await this.email.evaluate((element: HTMLInputElement) => ({
      type: element.type,
      valid: element.validity.valid,
      typeMismatch: element.validity.typeMismatch,
    }));
    expect(validity).toEqual({ type: 'email', valid: false, typeMismatch: true });
    await expect(this.confirmBooking).toBeVisible();
  }

  async expectBookingConfirmation(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Booking Confirmed!/i })).toBeVisible();
  }

  async openBookingsFromConfirmation(): Promise<void> {
    const bookingsResponse = this.page.waitForResponse((response) => {
      const pathname = new URL(response.url()).pathname;
      return response.request().method() === 'GET' && /\/bookings$/.test(pathname);
    });

    await this.page.getByRole('link', { name: 'View My Bookings', exact: true }).click();
    const response = await bookingsResponse;
    expect(response.ok(), `GET bookings failed with ${response.status()}`).toBeTruthy();
    await expect(this.page).toHaveURL(/\/bookings$/);
  }
}
