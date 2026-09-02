import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans Search & Filter API Tests - /api/v2/spartans/search', () => {

    let testSpartanId;
    const searchPrefix = `UniqueSearch_${Date.now()}`;

    test.beforeAll(async ({ request }) => {
        // Create a unique Spartan for deterministic search testing
        const newSpartan = {
            name: `${searchPrefix}_Alex`,
            gender: 'Female',
            phone: faker.string.numeric(11)
        };

        const postResponse = await request.post('/api/v2/spartans', { data: newSpartan });
        const postBody = await postResponse.json();
        testSpartanId = postBody.data.id;
    });

    test.afterAll(async ({ request }) => {
        if (testSpartanId) {
            await request.delete(`/api/v2/spartans/${testSpartanId}`);
        }
    });

    test('GET /api/v2/spartans/search - Filter by nameContains parameter', async ({ request }) => {
        const response = await request.get(`/api/v2/spartans/search?nameContains=${searchPrefix}`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('data');
        expect(body.data.length).toBeGreaterThanOrEqual(1);

        for (const spartan of body.data) {
            expect(spartan.name.toLowerCase()).toContain(searchPrefix.toLowerCase());
        }
    });

    test('GET /api/v2/spartans/search - Filter by gender parameter', async ({ request }) => {
        const response = await request.get('/api/v2/spartans/search?gender=Female');

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('data');

        for (const spartan of body.data) {
            expect(spartan.gender).toBe('Female');
        }
    });

    test('GET /api/v2/spartans/search - Filter by both nameContains AND gender', async ({ request }) => {
        const response = await request.get(`/api/v2/spartans/search?nameContains=${searchPrefix}&gender=Female`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.data.length).toBeGreaterThanOrEqual(1);

        const match = body.data.find(s => s.id === testSpartanId);
        expect(match).toBeDefined();
        expect(match.name).toContain(searchPrefix);
        expect(match.gender).toBe('Female');
    });

    test('GET /api/v2/spartans/search - Non-matching search criteria returns empty array', async ({ request }) => {
        const nonMatchingQuery = `NonExistentName_${Date.now()}_XYZ`;
        const response = await request.get(`/api/v2/spartans/search?nameContains=${nonMatchingQuery}`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.totalElement).toBe(0);
        expect(body.data.length).toBe(0);
    });

});
