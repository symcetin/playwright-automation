import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans WebApp - Add Spartan Form Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/v2/spartans');
        const addBtn = page.locator('#add_spartan_btn, a[href*="/web/v2/spartans/add"], a:has-text("Add Spartan")').first();
        await addBtn.click();
        await expect(page).toHaveURL(/\/web\/v2\/spartans\/add/);
    });

    test('Add Spartan - Positive: Fill form with valid details and submit', async ({ page, request }) => {
        const testName = `UI_Add_${faker.person.firstName()}`;
        const testPhone = faker.string.numeric(11);

        // Fill form fields
        await page.fill('input#name', testName);
        await page.selectOption('select#genderSelect', 'MALE');
        await page.fill('input#phone', testPhone);

        // Click Submit / Save button
        const submitBtn = page.locator('#submit_btn, input[type="submit"], button[type="submit"]').first();
        await submitBtn.click();

        // Verify redirection back to List Page
        await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

        // Search for newly created Spartan to verify presence
        await page.fill('input#name', testName);
        await page.click('#search');

        const row = page.locator('table tbody tr', { hasText: testName });
        await expect(row).toBeVisible();

        // Teardown: Delete created Spartan via API
        const searchRes = await request.get(`/api/v2/spartans/search?nameContains=${testName}`);
        const searchBody = await searchRes.json();
        if (searchBody.data && searchBody.data.length > 0) {
            const createdId = searchBody.data[0].id;
            await request.delete(`/api/v2/spartans/${createdId}`);
        }
    });

    test('Add Spartan - Negative: Submitting empty form prevents successful creation', async ({ page }) => {
        // Leave name empty and attempt submit
        const submitBtn = page.locator('#submit_btn, input[type="submit"], button[type="submit"]').first();
        await submitBtn.click();

        // Verify user is not redirected to main list page (/web/v2/spartans)
        await expect(page).not.toHaveURL(/\/web\/v2\/spartans$/);
    });

});
