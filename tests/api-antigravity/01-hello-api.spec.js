import { expect, test } from '@playwright/test';

test.describe('Hello API Tests - /api/v2/hello', () => {

    test('GET /api/v2/hello - Should return 200 OK and "Hello World!" text', async ({ request }) => {
        const response = await request.get('/api/v2/hello');

        // Verify status code is 200 OK
        expect(response.status()).toBe(200);

        // Verify Content-Type header contains text/plain
        const contentType = response.headers()['content-type'];
        expect(contentType).toContain('text/plain');

        // Verify response body text
        const responseText = await response.text();
        expect(responseText).toBe('Hello World!');
    });

    test('HEAD /api/v2/hello - Should respond with status 200 OK', async ({ request }) => {
        const response = await request.head('/api/v2/hello');
        expect(response.status()).toBe(200);
    });

});
