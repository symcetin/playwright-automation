import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans PUT & PATCH API Tests - /api/v2/spartans/{id}', () => {

    let testSpartanId;

    test.beforeEach(async ({ request }) => {
        // Create a dedicated Spartan for update testing
        const initialData = {
            name: `Initial_${faker.person.firstName()}`,
            gender: 'Female',
            phone: faker.string.numeric(11)
        };

        const postResponse = await request.post('/api/v2/spartans', { data: initialData });
        const postBody = await postResponse.json();
        testSpartanId = postBody.data.id;
    });

    test.afterEach(async ({ request }) => {
        // Cleanup after test
        if (testSpartanId) {
            await request.delete(`/api/v2/spartans/${testSpartanId}`);
            testSpartanId = null;
        }
    });

    test('PUT /api/v2/spartans/{id} - Positive: Should perform full update on Spartan', async ({ request }) => {
        const updatedData = {
            name: `Updated_${faker.person.firstName()}`,
            gender: 'Male',
            phone: faker.string.numeric(12)
        };

        const response = await request.put(`/api/v2/spartans/${testSpartanId}`, {
            data: updatedData
        });

        expect(response.status()).toBe(200);

        // Verify update persisted via GET
        const getResponse = await request.get(`/api/v2/spartans/${testSpartanId}`);
        expect(getResponse.status()).toBe(200);
        const getBody = await getResponse.json();
        const spartanData = getBody.data ? getBody.data : getBody;

        expect(spartanData.name).toBe(updatedData.name);
        expect(spartanData.gender).toBe(updatedData.gender);
        expect(spartanData.phone).toBe(updatedData.phone);
    });

    test('PATCH /api/v2/spartans/{id} - Positive: Should perform partial update on Spartan', async ({ request }) => {
        const partialData = {
            phone: '99988877766'
        };

        const response = await request.patch(`/api/v2/spartans/${testSpartanId}`, {
            data: partialData
        });

        expect(response.status()).toBe(200);

        // Verify partial update persisted via GET
        const getResponse = await request.get(`/api/v2/spartans/${testSpartanId}`);
        const getBody = await getResponse.json();
        const spartanData = getBody.data ? getBody.data : getBody;

        expect(spartanData.phone).toBe(partialData.phone);
    });

    test('PUT /api/v2/spartans/{id} - Negative: Should return 404 for non-existent Spartan ID', async ({ request }) => {
        const invalidId = 99999999;
        const response = await request.put(`/api/v2/spartans/${invalidId}`, {
            data: {
                name: 'NoBody',
                gender: 'Male',
                phone: '12345678901'
            }
        });

        expect(response.status()).toBe(404);
    });

});
