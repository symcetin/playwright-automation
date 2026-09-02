import { test, expect } from '@playwright/test';

test('POST request', async ({ request }) => {

    const newSpartan = {
        "name": "Muhtar Mahmut",
        "gender": "Male",
        "phone": "1234567890"
    }

    const response = await request.post("/api/v2/spartans", {data: newSpartan});

    // verify that status code is 201
    expect(response.status()).toBe(201);


    // verify that the conetnt type is application/json.
    expect(response.headers()["content-type"]).toContain("application/json");

   const responseBody = await response.json();
    

    // verify that the message in the json body is "Successfully created the Spartan."
    expect(responseBody.message).toContain("Successfully created the Spartan.");
  
});
