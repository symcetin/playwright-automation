import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans DELETE API Tests - /api/v2/spartans/{id}', () => {

    test('DELETE /api/v2/spartans/{id} - Positive: Should successfully delete an existing Spartan', async ({ request }) => {
        // 1. Create a Spartan to delete
        const tempSpartan = {
            name: `ToDelete_${faker.person.firstName()}`,
            gender: 'Male',
            phone: faker.string.numeric(11)
        };

        const postResponse = await request.post('/api/v2/spartans', { data: tempSpartan });
        expect(postResponse.status()).toBe(201);
        const postBody = await postResponse.json();
        const createdId = postBody.data.id;

        // 2. Perform DELETE request
        const deleteResponse = await request.delete(`/api/v2/spartans/${createdId}`);
        expect([200, 204]).toContain(deleteResponse.status());

        // 3. Verify Spartan is no longer accessible via GET (returns 404)
        const getResponse = await request.get(`/api/v2/spartans/${createdId}`);
        expect(getResponse.status()).toBe(404);
    });

    test('DELETE /api/v2/spartans/{id} - Negative: Should return 404 Not Found for non-existent Spartan ID', async ({ request }) => {
        const nonExistentId = 99999999;
        const deleteResponse = await request.delete(`/api/v2/spartans/${nonExistentId}`);
        expect(deleteResponse.status()).toBe(404);
    });

});
