import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Hybrid E2E - API & UI Real-Time Synchronization', () => {

    test('API Creation -> UI Visibility -> API Deletion -> UI Removal Verification', async ({ page, request }) => {
        const testName = `Sync_${faker.person.firstName()}`;
        const testPhone = faker.string.numeric(11);

        // STEP 1: Create Spartan via REST API
        const createRes = await request.post('/api/v2/spartans', {
            data: { name: testName, gender: 'Male', phone: testPhone }
        });
        expect(createRes.status()).toBe(201);
        const createBody = await createRes.json();
        const createdId = createBody.data.id;

        // STEP 2: Verify Spartan appears in Web App UI table
        await page.goto('/web/v2/spartans');
        await page.fill('input#name', testName);
        await page.click('#search');

        const visibleRow = page.locator('table tbody tr', { hasText: testName });
        await expect(visibleRow).toBeVisible();

        // STEP 3: Delete Spartan directly via REST API backend
        const deleteRes = await request.delete(`/api/v2/spartans/${createdId}`);
        expect([200, 204]).toContain(deleteRes.status());

        // STEP 4: Reload Web App UI and verify Spartan is completely removed
        await page.goto('/web/v2/spartans');
        await page.fill('input#name', testName);
        await page.click('#search');

        const deletedRow = page.locator('table tbody tr', { hasText: testName });
        await expect(deletedRow).not.toBeVisible();
    });

});
