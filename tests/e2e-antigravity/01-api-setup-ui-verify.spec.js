import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Hybrid E2E - API Data Setup & UI Management', () => {

    test('Create Spartan via API -> Verify & Edit via UI -> Confirm via API', async ({ page, request }) => {
        const initialName = `E2E_API_${faker.person.firstName()}`;
        const initialPhone = faker.string.numeric(11);
        const updatedName = `E2E_UI_${faker.person.firstName()}`;
        const updatedPhone = faker.string.numeric(11);

        // STEP 1: Fast Data Seeding via REST API
        const createPayload = {
            name: initialName,
            gender: 'Male',
            phone: initialPhone
        };

        const postResponse = await request.post('/api/v2/spartans', { data: createPayload });
        expect(postResponse.status()).toBe(201);
        const postBody = await postResponse.json();
        const spartanId = postBody.data.id;
        expect(spartanId).toBeDefined();

        try {
            // STEP 2: Navigate UI to verify seeded Spartan
            await page.goto('/web/v2/spartans');
            await page.fill('input#name', initialName);
            await page.click('#search');

            const row = page.locator('table tbody tr', { hasText: initialName });
            await expect(row).toBeVisible();

            // STEP 3: Perform UI Edit on the seeded Spartan
            const editBtn = row.locator(`a[href*="/web/v2/spartans/edit/${spartanId}"]`).first();
            await editBtn.click();
            await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/edit/${spartanId}$`));

            // Fill UI form with updated details
            await page.fill('input#name', updatedName);
            await page.fill('input#phone', updatedPhone);
            await page.click('#submit_btn, input[type="submit"], button[type="submit"]');

            await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

            // STEP 4: Backend API verification of the UI update
            const getResponse = await request.get(`/api/v2/spartans/${spartanId}`);
            expect(getResponse.status()).toBe(200);
            const getBody = await getResponse.json();
            const spartanData = getBody.data ? getBody.data : getBody;

            expect(spartanData.name).toBe(updatedName);
            expect(spartanData.phone).toBe(updatedPhone);

        } finally {
            // STEP 5: Teardown via REST API
            await request.delete(`/api/v2/spartans/${spartanId}`);
        }
    });

});
