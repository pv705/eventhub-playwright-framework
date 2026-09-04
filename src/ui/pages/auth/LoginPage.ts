import { expect, type Page } from '@playwright/test';

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
    await this.email.fill(email);
    await this.password.fill(password);
    const responsePromise = this.page.waitForResponse((response) => response.url().includes('/auth/login'));
    await this.signIn.click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`UI login failed with ${response.status()}: ${await response.text()}`);
    }
  }
}
