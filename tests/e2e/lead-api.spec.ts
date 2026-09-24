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
  test.skip(process.env.SITE_MODE !== "live", "Portfolio mode is active");
  const response = await request.post("/api/leads", {
    data: { ...validLead, cleaningType: "unknown" },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ success: false, code: "VALIDATION_ERROR" });
});

test("portfolio mode rejects direct lead submissions", async ({ request }) => {
  test.skip(process.env.SITE_MODE === "live", "Live mode is active");
  const response = await request.post("/api/leads", { data: validLead });
  expect(response.status()).toBe(500);
  expect(await response.json()).toEqual({ success: false, code: "SUBMISSION_ERROR" });
});
