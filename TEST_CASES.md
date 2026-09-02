# Spartan App - Automated Test Cases Documentation

This document contains the complete catalog of **29 automated test cases** implemented for the **Spartan REST API** and **Spartan Web Application** using **Playwright**.

---

## 📊 Summary & Test Suite Breakdown

| Suite Category | Directory | Description | Total Tests |
| :--- | :--- | :--- | :---: |
| **API Test Suite** | `tests/api-antigravity/` | Direct REST API endpoint testing, HTTP status codes, JSON schemas, validation errors, and CRUD operations. | **18** |
| **UI Test Suite** | `tests/ui-antigravity/` | Web application browser testing, layout assertions, form interactions, search/filtering, and end-to-end user flows. | **8** |
| **Hybrid E2E Suite** | `tests/e2e-antigravity/` | Combined API + UI integration tests for fast data setup, cross-tier validation, and real-time backend/frontend synchronization. | **3** |
| **Total Framework Coverage** | | | **29** |

---

## 📡 1. REST API Test Cases (`tests/api-antigravity/`)

### `01-hello-api.spec.js`
#### TC-API-01: Verify GET /api/v2/hello Response
* **Description:** Validate Hello World health-check endpoint.
* **Preconditions:** Server is online at `https://spartan-app-new-nonsecure.onrender.com`.
* **Execution Steps:**
  1. Send `GET` request to `/api/v2/hello`.
* **Expected Result:** Status `200 OK`, header `Content-Type: text/plain`, body string `"Hello World!"`.

#### TC-API-02: Verify HEAD /api/v2/hello Response
* **Description:** Validate HEAD request on hello endpoint.
* **Execution Steps:**
  1. Send `HEAD` request to `/api/v2/hello`.
* **Expected Result:** Status `200 OK`.

---

### `02-spartans-get.spec.js`
#### TC-API-03: Retrieve All Spartans (GET /api/v2/spartans)
* **Description:** Fetch the complete list of Spartans and validate response structure.
* **Execution Steps:**
  1. Send `GET` request to `/api/v2/spartans`.
* **Expected Result:** Status `200 OK`, `Content-Type: application/json`. ResponseWrapper contains `message`, `totalElement` (number), and `data` array matching total count. Each item contains `id`, `name`, `gender`, `phone`.

#### TC-API-04: Retrieve Single Spartan by Valid ID (GET /api/v2/spartans/{id})
* **Description:** Retrieve a specific Spartan using a valid ID.
* **Execution Steps:**
  1. Get list of existing Spartans.
  2. Pick the first Spartan's ID.
  3. Send `GET` request to `/api/v2/spartans/{id}`.
* **Expected Result:** Status `200 OK`. Returned Spartan details (`id`, `name`, `gender`, `phone`) match requested ID.

#### TC-API-05: Retrieve Spartan by Non-Existent ID (Negative)
* **Description:** Verify 404 response for invalid/non-existent Spartan ID.
* **Execution Steps:**
  1. Send `GET` request to `/api/v2/spartans/99999999`.
* **Expected Result:** Status `404 Not Found` with exception error payload.

---

### `03-spartans-post.spec.js`
#### TC-API-06: Create Spartan with Valid Data (Positive)
* **Description:** Create a new Spartan record via API using dynamic test data.
* **Execution Steps:**
  1. Generate random valid payload (`name`, `gender: 'Male'`, 11-digit `phone`).
  2. Send `POST` request to `/api/v2/spartans`.
* **Expected Result:** Status `201 Created`. Response contains message `"Successfully created the Spartan."`, generated `id`, and matching data fields. Teardown deletes record.

#### TC-API-07: Create Spartan with Missing Fields (Negative)
* **Description:** Validate 400 response when submitting empty payload.
* **Execution Steps:**
  1. Send `POST` request to `/api/v2/spartans` with `{}` payload.
* **Expected Result:** Status `400 Bad Request` with `ValidationExceptionWrapper`.

#### TC-API-08: Create Spartan with Invalid Gender (Negative)
* **Description:** Validate error handling for invalid gender value (`"Alien"`).
* **Execution Steps:**
  1. Send `POST` request with invalid gender value.
* **Expected Result:** Status `400 Bad Request` or `500 Internal Server Error`.

#### TC-API-09: Create Spartan with Short Phone Number (Negative)
* **Description:** Validate phone number length constraint (<10 digits).
* **Execution Steps:**
  1. Send `POST` request with phone `"12345"`.
* **Expected Result:** Status `400 Bad Request`.

---

### `04-spartans-put-patch.spec.js`
#### TC-API-10: Full Update Spartan (PUT /api/v2/spartans/{id})
* **Description:** Perform complete resource update for existing Spartan.
* **Execution Steps:**
  1. Seed temporary Spartan via API.
  2. Send `PUT` request with updated `name`, `gender`, `phone`.
  3. Send `GET` request to verify persistence.
* **Expected Result:** Status `200 OK`. GET response confirms updated field values.

#### TC-API-11: Partial Update Spartan (PATCH /api/v2/spartans/{id})
* **Description:** Perform partial field update (e.g., phone number only).
* **Execution Steps:**
  1. Seed temporary Spartan via API.
  2. Send `PATCH` request updating only `phone`.
* **Expected Result:** Status `200 OK`. Phone number is updated while other fields remain intact.

#### TC-API-12: Update Non-Existent Spartan (Negative)
* **Description:** Verify update failure on non-existent ID.
* **Execution Steps:**
  1. Send `PUT` request to `/api/v2/spartans/99999999`.
* **Expected Result:** Status `404 Not Found`.

---

### `05-spartans-delete.spec.js`
#### TC-API-13: Delete Spartan by ID (Positive)
* **Description:** Remove existing Spartan record from system.
* **Execution Steps:**
  1. Seed temporary Spartan.
  2. Send `DELETE` request to `/api/v2/spartans/{id}`.
  3. Send `GET` request for deleted ID.
* **Expected Result:** Delete returns `200 OK` or `204`. Subsequent GET returns `404 Not Found`.

#### TC-API-14: Delete Non-Existent Spartan (Negative)
* **Description:** Verify 404 response when deleting invalid ID.
* **Execution Steps:**
  1. Send `DELETE` request to `/api/v2/spartans/99999999`.
* **Expected Result:** Status `404 Not Found`.

---

### `06-spartans-search.spec.js`
#### TC-API-15: Search Spartans by `nameContains`
* **Execution Steps:** Send `GET /api/v2/spartans/search?nameContains={name}`.
* **Expected Result:** Status `200 OK`. All returned records contain requested substring.

#### TC-API-16: Search Spartans by `gender`
* **Execution Steps:** Send `GET /api/v2/spartans/search?gender=Female`.
* **Expected Result:** Status `200 OK`. All returned records have `gender: "Female"`.

#### TC-API-17: Search Spartans by `nameContains` AND `gender`
* **Execution Steps:** Send `GET /api/v2/spartans/search?nameContains={name}&gender=Female`.
* **Expected Result:** Status `200 OK`. Results satisfy both parameters.

#### TC-API-18: Search Spartans with No Matches
* **Execution Steps:** Send `GET /api/v2/spartans/search?nameContains=NonExistent123`.
* **Expected Result:** Status `200 OK`, `totalElement: 0`, empty data array `[]`.

---

## 🖥️ 2. Web Application UI Test Cases (`tests/ui-antigravity/`)

### `01-spartans-list.spec.js`
#### TC-UI-01: Verify Main List Page Elements & Header
* **Execution Steps:** Navigate to `/web/v2/spartans`.
* **Expected Result:** Brand navbar visible, "Add Spartan" button present, `#total` counter badge displays total count, search inputs (`#name`, `#gender`, `#search`, `#clear`) present.

#### TC-UI-02: Verify Spartan Data Table Structure
* **Execution Steps:** Inspect `table` element on `/web/v2/spartans`.
* **Expected Result:** Header columns include `ID`, `Name`, `Phone`, `Gender`, `View`, `Edit`, `Delete`. Table contains populated rows.

---

### `02-add-spartan.spec.js`
#### TC-UI-03: Add Spartan via UI (Positive)
* **Execution Steps:**
  1. Click "Add Spartan" button -> navigate to `/web/v2/spartans/add`.
  2. Fill Name, select Gender (`MALE`), fill Phone.
  3. Click Submit button.
* **Expected Result:** Redirected to `/web/v2/spartans`. Searching for created Spartan displays record in table. Teardown via API.

#### TC-UI-04: Submit Empty Add Spartan Form (Negative)
* **Execution Steps:** Navigate to `/web/v2/spartans/add` and click Submit without filling fields.
* **Expected Result:** Form submission blocked; user remains on `/web/v2/spartans/add`.

---

### `03-search-spartans.spec.js`
#### TC-UI-05: Filter Table by Name Input
* **Execution Steps:** Seed Spartan via API, enter name into `input#name`, click `#search`.
* **Expected Result:** Table filters to display matching Spartan row.

#### TC-UI-06: Filter Table by Gender Dropdown
* **Execution Steps:** Select `"Female"` in `select#gender`, click `#search`.
* **Expected Result:** Table displays matching female Spartan rows.

#### TC-UI-07: Reset Search Filters via Clear Button
* **Execution Steps:** Apply name filter, click `#clear` button.
* **Expected Result:** `input#name` value cleared, full table rows restored.

---

### `04-spartan-crud-lifecycle.spec.js`
#### TC-UI-08: Complete E2E UI CRUD Flow
* **Execution Steps:**
  1. **Create:** Add new Spartan via UI form.
  2. **Search:** Filter for created Spartan in list.
  3. **View:** Click View icon, verify detail input values (`input#name`, `input#phone`), click Back.
  4. **Edit:** Click Edit icon, update Name & Phone, submit update.
  5. **Verify:** Search updated Spartan, confirm table reflects new details.
  6. **Delete:** Click Delete icon. Search again and confirm removal.
* **Expected Result:** Complete lifecycle finishes without errors.

---

## 🔄 3. Hybrid E2E Test Cases (`tests/e2e-antigravity/`)

### `01-api-setup-ui-verify.spec.js`
#### TC-E2E-01: API Data Setup -> UI Edit -> API Verification
* **Execution Steps:**
  1. Seed Spartan via REST API (`POST /api/v2/spartans`).
  2. Open Web App UI (`/web/v2/spartans`), search seeded Spartan, click Edit.
  3. Update Name & Phone in UI form and submit.
  4. Query REST API (`GET /api/v2/spartans/{id}`) to verify backend persistence.
  5. Delete Spartan via REST API teardown.
* **Expected Result:** UI changes are accurately reflected in REST API payload.

---

### `02-ui-create-api-verify.spec.js`
#### TC-E2E-02: UI Creation -> API Backend Schema Validation
* **Execution Steps:**
  1. Create Spartan via UI form (`/web/v2/spartans/add`).
  2. Call REST API search endpoint (`GET /api/v2/spartans/search?nameContains=...`).
  3. Assert API `ResponseWrapper` status 200, matching data fields (`name`, `gender: 'Female'`, `phone`).
  4. Delete record via REST API.
* **Expected Result:** UI form creation produces compliant API JSON payload.

---

### `03-hybrid-crud-sync.spec.js`
#### TC-E2E-03: Real-Time API & UI State Synchronization
* **Execution Steps:**
  1. Create Spartan via REST API.
  2. Open Web App UI, search for record, confirm table row visibility.
  3. Delete Spartan via REST API backend.
  4. Reload Web App UI page, search again.
* **Expected Result:** Spartan is immediately removed from Web App UI table after API deletion.

---

## 🚀 Execution Commands

```bash
# Run All Test Suites (API, UI, Hybrid E2E)
npx playwright test tests/api-antigravity tests/ui-antigravity tests/e2e-antigravity

# Run in Headed Browser Mode
npx playwright test tests/api-antigravity tests/ui-antigravity tests/e2e-antigravity --headed

# Run Specific Suite
npx playwright test tests/api-antigravity
npx playwright test tests/ui-antigravity
npx playwright test tests/e2e-antigravity

# Generate HTML Execution Report
npx playwright show-report
```
