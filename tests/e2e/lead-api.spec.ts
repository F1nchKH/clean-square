import { expect, test } from "@playwright/test";

const validLead = {
  name: "Анна",
  phone: "+7 999 123-45-67",
  cleaningType: "maintenance",
  area: 50,
  addOns: [],
  consent: true,
};

test("invalid HTTP lead request gets only the public validation error", async ({ request }) => {
  const response = await request.post("/api/leads", {
    data: { ...validLead, cleaningType: "unknown" },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ success: false, code: "VALIDATION_ERROR" });
});

test("valid HTTP lead request fails safely until persistence is connected", async ({ request }) => {
  const response = await request.post("/api/leads", { data: validLead });
  const body = await response.text();

  expect(response.status()).toBe(500);
  expect(JSON.parse(body)).toEqual({ success: false, code: "SUBMISSION_ERROR" });
  expect(body).not.toContain("persistence");
});
