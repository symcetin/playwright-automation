import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Hybrid E2E - UI Creation & API Backend Validation', () => {

    test('Create Spartan via UI -> Validate JSON Payload & Schema via API', async ({ page, request }) => {
        const testName = `Hybrid_UI_${faker.person.firstName()}`;
        const testPhone = faker.string.numeric(11);
        let createdId;

        try {
            // STEP 1: Create Spartan using Web Application UI
            await page.goto('/web/v2/spartans');
            const addBtn = page.locator('#add_spartan_btn, a[href*="/web/v2/spartans/add"]').first();
            await addBtn.click();
            await expect(page).toHaveURL(/\/web\/v2\/spartans\/add$/);

            await page.fill('input#name', testName);
            await page.selectOption('select#genderSelect', 'FEMALE');
            await page.fill('input#phone', testPhone);
            await page.click('#submit_btn, input[type="submit"], button[type="submit"]');

            await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

            // STEP 2: Query API search endpoint to locate created record
            const searchResponse = await request.get(`/api/v2/spartans/search?nameContains=${testName}`);
            expect(searchResponse.status()).toBe(200);

            const searchBody = await searchResponse.json();
            expect(searchBody.totalElement).toBeGreaterThanOrEqual(1);

            const record = searchBody.data.find(s => s.name === testName);
            expect(record).toBeDefined();
            expect(record.gender).toBe('Female');
            expect(record.phone).toBe(testPhone);

            createdId = record.id;

            // STEP 3: Directly query single record API endpoint by ID
            const getByIdResponse = await request.get(`/api/v2/spartans/${createdId}`);
            expect(getByIdResponse.status()).toBe(200);

            const getByIdBody = await getByIdResponse.json();
            const spartanData = getByIdBody.data ? getByIdBody.data : getByIdBody;

            expect(spartanData.id).toBe(createdId);
            expect(spartanData.name).toBe(testName);
            expect(spartanData.phone).toBe(testPhone);

        } finally {
            // STEP 4: Cleanup created record via REST API
            if (createdId) {
                await request.delete(`/api/v2/spartans/${createdId}`);
            }
        }
    });

});
