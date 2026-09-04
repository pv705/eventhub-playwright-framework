import { expect, type Page, type Response } from '@playwright/test';

/** Encapsulates login form locators and network-aware submission. */
export class LoginPage {
  private readonly email;
  private readonly password;
  private readonly signIn;

  public constructor(private readonly page: Page) {
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.signIn = page.getByRole('button', { name: 'Sign In' });
  }

  async open(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.signIn).toBeVisible();
  }

  async signInAs(email: string, password: string): Promise<void> {
    const response = await this.submit(email, password);
    if (!response.ok()) {
      throw new Error(`UI login failed with ${response.status()}: ${await response.text()}`);
    }
  }

  async signInExpectingFailure(email: string, password: string): Promise<number> {
    const response = await this.submit(email, password);
    return response.status();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === '/login');
    await expect(this.page.getByText('Invalid email or password', { exact: true })).toBeVisible();
  }

  async expectSignInSucceeded(): Promise<void> {
    await expect(this.page).toHaveURL((url) => url.pathname === '/');
  }

  private async submit(email: string, password: string): Promise<Response> {
    await this.email.fill(email);
    await this.password.fill(password);
    // Register the listener before clicking so a fast response cannot be missed.
    const responsePromise = this.page.waitForResponse((response) => response.url().includes('/auth/login'));
    await this.signIn.click();
    return responsePromise;
  }
}
