import { test, expect } from '../../../src/domain/fixtures/test.js';
import { LoginPage } from '../../../src/ui/pages/auth/LoginPage.js';
import { RegisterPage } from '../../../src/ui/pages/auth/RegisterPage.js';

test.describe('Authentication', () => {
  test('registers an isolated user through the API @smoke', async ({ api, credentials }) => {
    const response = await api.auth.register(credentials);
    expect(response.token ?? response.accessToken).toBeTruthy();
  });

  test('opens the login experience @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(page.getByRole('heading', { name: 'Sign in to EventHub' })).toBeVisible();
  });

  test('renders registration validation controls @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.open();
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeEnabled();
  });
});
