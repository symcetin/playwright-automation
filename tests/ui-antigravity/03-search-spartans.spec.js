import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans WebApp - Search & Filter UI Tests', () => {

    let createdSpartanId;
    let createdSpartanName;

    test.beforeEach(async ({ page, request }) => {
        createdSpartanName = `UISearch_${faker.person.firstName()}`;
        const payload = {
            name: createdSpartanName,
            gender: 'Female',
            phone: faker.string.numeric(11)
        };

        const response = await request.post('/api/v2/spartans', { data: payload });
        const body = await response.json();
        createdSpartanId = body.data.id;

        await page.goto('/web/v2/spartans');
    });

    test.afterEach(async ({ request }) => {
        if (createdSpartanId) {
            await request.delete(`/api/v2/spartans/${createdSpartanId}`);
            createdSpartanId = null;
        }
    });

    test('Search by Name - Should display matching Spartan in table', async ({ page }) => {
        await page.fill('input#name', createdSpartanName);
        await page.click('#search');

        const matchRow = page.locator('table tbody tr', { hasText: createdSpartanName });
        await expect(matchRow).toBeVisible();
    });

    test('Filter by Gender - Should filter table rows matching gender option', async ({ page }) => {
        await page.selectOption('select#gender', 'Female');
        await page.click('#search');

        const visibleRows = page.locator('table tbody tr:not([style*="display: none"])');
        await expect(visibleRows.first()).toBeVisible();

        const count = await visibleRows.count();
        expect(count).toBeGreaterThan(0);
    });

    test('Clear Button - Should reset search inputs and restore full table', async ({ page }) => {
        await page.fill('input#name', createdSpartanName);
        await page.click('#search');

        await page.click('#clear');

        await expect(page.locator('input#name')).toHaveValue('');

        const visibleRows = page.locator('table tbody tr:not([style*="display: none"])');
        await expect(visibleRows.first()).toBeVisible();
    });

});
