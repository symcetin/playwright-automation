// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Context Fixture Examples', () => {
  test('should demonstrate basic fixture usage', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should interact with elements', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Get and verify heading is visible
    const heading = page.getByRole('heading', { name: 'Playwright enables reliable' });
    await expect(heading).toBeVisible();
  });

  test('should fill out a form', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Example: Fill input field
    // await page.fill('input[name="username"]', 'testuser');
    // await page.click('button[type="submit"]');
  });
});
