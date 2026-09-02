import { test, expect } from '@playwright/test';

test('DELETE request', async ({ request }) => {

    let id = 1200;

    const response = await request.delete(`/api/v2/spartans/${id}`);

    // verify status code is 200.
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // verify the message in the json body.
    expect(responseBody.message).toContain("Successfully deleted the Spartan.");

    // verify the content type header
    expect(response.headers()["content-type"]).toContain("application/json");

});