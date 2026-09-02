import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Spartans POST API Tests - /api/v2/spartans', () => {

    let createdSpartanId;

    test.afterEach(async ({ request }) => {
        // Clean up created Spartan if ID exists
        if (createdSpartanId) {
            await request.delete(`/api/v2/spartans/${createdSpartanId}`);
            createdSpartanId = null;
        }
    });

    test('POST /api/v2/spartans - Positive: Should create a new Spartan with valid data', async ({ request }) => {
        const newSpartan = {
            name: `Test_${faker.person.firstName()}`,
            gender: 'Male',
            phone: faker.string.numeric(11)
        };

        const response = await request.post('/api/v2/spartans', {
            data: newSpartan,
            headers: { 'Content-Type': 'application/json' }
        });

        expect(response.status()).toBe(201);
        expect(response.headers()['content-type']).toContain('application/json');

        const body = await response.json();
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('Successfully created the Spartan.');
        expect(body).toHaveProperty('data');

        const spartanData = body.data;
        expect(spartanData.name).toBe(newSpartan.name);
        expect(spartanData.gender).toBe(newSpartan.gender);
        expect(spartanData.phone).toBe(newSpartan.phone);
        expect(spartanData.id).toBeDefined();

        createdSpartanId = spartanData.id;
    });

    test('POST /api/v2/spartans - Negative: Should return 400 Bad Request when required fields are missing', async ({ request }) => {
        const invalidPayload = {};

        const response = await request.post('/api/v2/spartans', {
            data: invalidPayload
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message');
    });

    test('POST /api/v2/spartans - Negative: Should return 400/500 for invalid gender', async ({ request }) => {
        const invalidGenderPayload = {
            name: 'ValidName',
            gender: 'Alien',
            phone: '12345678901'
        };

        const response = await request.post('/api/v2/spartans', {
            data: invalidGenderPayload
        });

        // Server returns 500 Internal Server Error when enum validation fails at database level
        expect([400, 500]).toContain(response.status());
    });

    test('POST /api/v2/spartans - Negative: Should return 400 Bad Request for short phone number (<10 digits)', async ({ request }) => {
        const invalidPhonePayload = {
            name: 'ValidName',
            gender: 'Female',
            phone: '12345'
        };

        const response = await request.post('/api/v2/spartans', {
            data: invalidPhonePayload
        });

        expect(response.status()).toBe(400);
    });

});
