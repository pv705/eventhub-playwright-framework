import { expect, type Page } from '@playwright/test';

/** Encapsulates registration form controls and submission behavior. */
export class RegisterPage {
  private readonly email;
  private readonly password;
  private readonly confirmation;
  private readonly createAccount;

  public constructor(private readonly page: Page) {
    this.email = page.getByRole('textbox', { name: 'you@email.com' });
    this.password = page.getByRole('textbox', { name: 'Min 8 chars, uppercase, number & symbol' });
    this.confirmation = page.getByRole('textbox', { name: 'Repeat your password' });
    this.createAccount = page.getByRole('button', { name: 'Create Account' });
  }

  async open(): Promise<void> {
    await this.page.goto('/register');
    await expect(this.createAccount).toBeVisible();
  }

  async register(email: string, password: string): Promise<void> {
    await this.fillForm(email, password, password);
    // Synchronize on the registration response before asserting the destination.
    const responsePromise = this.page.waitForResponse((response) => response.url().includes('/auth/register'));
    await this.createAccount.click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`UI registration failed with ${response.status()}: ${await response.text()}`);
    }
  }

  async expectRegistrationSucceeded(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === '/');
  }

  async submitForValidation(email: string, password: string, confirmation: string): Promise<void> {
    await this.fillForm(email, password, confirmation);
    await this.createAccount.click();
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === '/register');
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  private async fillForm(email: string, password: string, confirmation: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmation.fill(confirmation);
  }
}
