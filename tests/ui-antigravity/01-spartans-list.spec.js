import { expect, test } from '@playwright/test';

test.describe('Spartans WebApp - List Page Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/v2/spartans');
    });

    test('Verify List Page elements and header components', async ({ page }) => {
        // Verify Page URL
        await expect(page).toHaveURL(/\/web\/v2\/spartans/);

        // Verify navbar brand title
        const navbar = page.locator('.navbar');
        await expect(navbar).toBeVisible();

        // Verify "Add Spartan" button is visible and enabled
        const addSpartanBtn = page.locator('#add_spartan_btn, a[href*="/web/v2/spartans/add"], a:has-text("Add Spartan")').first();
        await expect(addSpartanBtn).toBeVisible();

        // Verify Total Spartans badge count element
        const totalBadge = page.locator('#total');
        await expect(totalBadge).toBeVisible();
        const totalText = await totalBadge.textContent();
        expect(totalText).toMatch(/Total:\s*\d+/i);

        // Verify Search Section controls exist
        await expect(page.locator('input#name')).toBeVisible();
        await expect(page.locator('select#gender')).toBeVisible();
        await expect(page.locator('#search')).toBeVisible();
        await expect(page.locator('#clear')).toBeVisible();
    });

    test('Verify Spartan Data Table columns and content structure', async ({ page }) => {
        const table = page.locator('table');
        await expect(table).toBeVisible();

        // Verify table headers
        const headers = page.locator('table th');
        const headerTexts = await headers.allTextContents();
        const normalizedHeaders = headerTexts.map(h => h.trim().toLowerCase());

        expect(normalizedHeaders).toContain('id');
        expect(normalizedHeaders).toContain('name');
        expect(normalizedHeaders).toContain('phone');
        expect(normalizedHeaders).toContain('gender');

        // Verify table has rows populated
        const rows = page.locator('table tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

});
