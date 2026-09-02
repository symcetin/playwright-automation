import { expect, test } from '@playwright/test';

test.describe('Spartans GET API Tests - /api/v2/spartans', () => {

    test('GET /api/v2/spartans - Should retrieve all Spartans with 200 OK', async ({ request }) => {
        const response = await request.get('/api/v2/spartans');

        // Status code check
        expect(response.status()).toBe(200);

        // Header check
        expect(response.headers()['content-type']).toContain('application/json');

        const body = await response.json();

        // ResponseWrapper schema validation
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('totalElement');
        expect(body).toHaveProperty('data');

        expect(typeof body.totalElement).toBe('number');
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBe(body.totalElement);

        // Validate first Spartan item schema if list is not empty
        if (body.data.length > 0) {
            const spartan = body.data[0];
            expect(spartan).toHaveProperty('id');
            expect(spartan).toHaveProperty('name');
            expect(spartan).toHaveProperty('gender');
            expect(spartan).toHaveProperty('phone');

            expect(typeof spartan.id).toBe('number');
            expect(typeof spartan.name).toBe('string');
            expect(['Male', 'Female']).toContain(spartan.gender);
        }
    });

    test('GET /api/v2/spartans/{id} - Positive: Should retrieve a single Spartan by valid ID', async ({ request }) => {
        // First get list to grab a valid existing ID
        const getListResponse = await request.get('/api/v2/spartans');
        const listBody = await getListResponse.json();
        expect(listBody.data.length).toBeGreaterThan(0);

        const targetSpartan = listBody.data[0];
        const targetId = targetSpartan.id;

        // Retrieve Spartan by ID
        const response = await request.get(`/api/v2/spartans/${targetId}`);
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');

        const body = await response.json();

        // Check if wrapped or direct DTO response
        const spartanData = body.data ? body.data : body;
        expect(spartanData.id).toBe(targetId);
        expect(spartanData.name).toBe(targetSpartan.name);
        expect(spartanData.gender).toBe(targetSpartan.gender);
        expect(spartanData.phone).toBe(targetSpartan.phone);
    });

    test('GET /api/v2/spartans/{id} - Negative: Should return 404 Not Found for non-existent ID', async ({ request }) => {
        const nonExistentId = 99999999;
        const response = await request.get(`/api/v2/spartans/${nonExistentId}`);

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body).toHaveProperty('message');
    });

});
