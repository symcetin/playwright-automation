import { test, expect } from '@playwright/test';

test('PUT request', async ({ request }) => {

    let id = 1198;

    const updatedSpartan = {
        "name": "Aygun",
        "gender": "Female",
        "phone": "5555555555"
    }

    const response = await request.put(`/api/v2/spartans/${id}`, {data: updatedSpartan});

    // verify that status code is 200 only.
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // verify the message in the json body.
    expect(responseBody.message).toContain("Successfully updated the Spartan.");

    // verify the content type header
    expect(response.headers()["content-type"]).toContain("application/json");


});


test('PATCH request', async ({ request }) => {

    let id = 1198;

    const updatedSpartan = {
        "phone": "6666666666"
    }

    const response = await request.patch(`/api/v2/spartans/${id}`, {data: updatedSpartan});

    // verify that status code is 200 only.
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // verify the message in the json body.
    expect(responseBody.message).toContain("Successfully updated the Spartan.");

    // verify the content type header
    expect(response.headers()["content-type"]).toContain("application/json");


});