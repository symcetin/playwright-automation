import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans WebApp - Full E2E CRUD Lifecycle Tests', () => {

    test('Complete E2E UI Flow: Create -> Search -> View -> Edit -> Delete', async ({ page }) => {
        const initialName = `E2E_Create_${faker.person.firstName()}`;
        const initialPhone = faker.string.numeric(11);
        const updatedName = `E2E_Update_${faker.person.firstName()}`;
        const updatedPhone = faker.string.numeric(11);

        // 1. CREATE: Navigate to Add Spartan page and submit form
        await page.goto('/web/v2/spartans');
        await page.click('#add_spartan_btn, a[href*="/web/v2/spartans/add"], a:has-text("Add Spartan")');

        await page.fill('input#name', initialName);
        await page.selectOption('select#genderSelect', 'MALE');
        await page.fill('input#phone', initialPhone);
        await page.click('#submit_btn, input[type="submit"], button[type="submit"]');

        await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

        // 2. SEARCH: Filter for created Spartan
        await page.fill('input#name', initialName);
        await page.click('#search');

        let spartanRow = page.locator('table tbody tr', { hasText: initialName });
        await expect(spartanRow).toBeVisible();

        // 3. VIEW: Click View button and check detail view
        const viewLink = spartanRow.locator('a[href*="/web/v2/spartans/"]').filter({ hasNotText: 'Edit' }).filter({ hasNotText: 'Delete' }).first();
        await viewLink.click();

        await expect(page).toHaveURL(/\/web\/v2\/spartans\/\d+/);
        await expect(page.locator('input#name')).toHaveValue(initialName);
        await expect(page.locator('input#phone')).toHaveValue(initialPhone);

        // Return to List
        const backBtn = page.locator('a:has-text("Back"), a[href*="/web/v2/spartans"]').first();
        await backBtn.click();
        await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

        // 4. EDIT: Search again and click Edit button
        await page.fill('input#name', initialName);
        await page.click('#search');

        spartanRow = page.locator('table tbody tr', { hasText: initialName });
        const editLink = spartanRow.locator('a[href*="/web/v2/spartans/edit/"]').first();
        await editLink.click();

        await expect(page).toHaveURL(/\/web\/v2\/spartans\/edit\/\d+/);

        // Modify fields and update
        await page.fill('input#name', updatedName);
        await page.fill('input#phone', updatedPhone);
        await page.click('#submit_btn, input[type="submit"], button[type="submit"]');

        await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

        // 5. VERIFY UPDATE: Search for updated Spartan
        await page.fill('input#name', updatedName);
        await page.click('#search');

        const updatedRow = page.locator('table tbody tr', { hasText: updatedName });
        await expect(updatedRow).toBeVisible();

        // 6. DELETE: Click Delete button and verify removal
        const deleteLink = updatedRow.locator('a[href*="/web/v2/spartans/delete/"], a.btn-danger, a:has-text("Delete")').first();
        await deleteLink.click();

        // Verify Spartan is no longer in list
        await page.fill('input#name', updatedName);
        await page.click('#search');

        const deletedRow = page.locator('table tbody tr', { hasText: updatedName });
        await expect(deletedRow).not.toBeVisible();
    });

});
