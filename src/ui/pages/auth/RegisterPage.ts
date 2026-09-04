import { expect, type Page } from '@playwright/test';

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
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmation.fill(password);
    await this.createAccount.click();
  }
}
