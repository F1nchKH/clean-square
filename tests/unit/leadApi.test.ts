import { describe, expect, it, vi } from "vitest";
import { createLeadPostHandler } from "../../src/app/api/leads/route";
import { submitLead } from "../../src/server/leads";

const validPayload = {
  name: "  Анна Иванова  ",
  phone: "  +7 (999) 123-45-67  ",
  cleaningType: "deep",
  area: 54,
  addOns: ["windows", "fridge"],
  consent: true,
};

function request(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  it("passes normalized input and a recalculated price to server orchestration", async () => {
    let received: unknown;
    const handler = createLeadPostHandler(async (lead) => { received = lead; });

    const response = await handler(request({ ...validPayload, totalPrice: 1 }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ success: true });
    expect(received).toEqual({
      name: "Анна Иванова",
      phone: "+7 (999) 123-45-67",
      cleaningType: "deep",
      area: 54,
      addOns: ["windows", "fridge"],
      consent: true,
      calculatedPrice: 7060,
    });
  });

  it.each([10, 500])("accepts the area boundary %i", async (area) => {
    let received: unknown;
    const handler = createLeadPostHandler(async (lead) => { received = lead; });

    const response = await handler(request({ ...validPayload, area }));

    expect(response.status).toBe(201);
    expect(received).toMatchObject({ area });
  });

  it.each([
    ["short name", { name: " А " }],
    ["long name", { name: "А".repeat(81) }],
    ["short phone", { phone: "123456" }],
    ["long phone", { phone: "1".repeat(16) }],
    ["invalid phone character", { phone: "1234567a" }],
    ["unknown cleaning type", { cleaningType: "other" }],
    ["numeric cleaning type", { cleaningType: 1 }],
    ["unknown add-on", { addOns: ["windows", "other"] }],
    ["numeric add-on", { addOns: [1] }],
    ["duplicate add-on", { addOns: ["windows", "windows"] }],
    ["non-array add-ons", { addOns: "windows" }],
    ["fractional area", { area: 10.5 }],
    ["string area", { area: "54" }],
    ["area below minimum", { area: 9 }],
    ["area above maximum", { area: 501 }],
    ["missing consent", { consent: undefined }],
    ["false consent", { consent: false }],
  ])("rejects %s before orchestration", async (_case, change) => {
    let called = false;
    const handler = createLeadPostHandler(async () => { called = true; });

    const response = await handler(request({ ...validPayload, ...change }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ success: false, code: "VALIDATION_ERROR" });
    expect(called).toBe(false);
  });

  it("rejects malformed JSON with a public validation error", async () => {
    const handler = createLeadPostHandler(async () => { throw new Error("must not be called"); });
    const response = await handler(new Request("http://localhost/api/leads", {
      method: "POST",
      body: "{broken",
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ success: false, code: "VALIDATION_ERROR" });
  });

  it("hides internal submission failures", async () => {
    const handler = createLeadPostHandler(async () => { throw new Error("secret database detail"); });
    const response = await handler(request(validPayload));
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(JSON.parse(body)).toEqual({ success: false, code: "SUBMISSION_ERROR" });
    expect(body).not.toContain("secret database detail");
  });

  it("fails closed when Supabase is not configured", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    try {
      const response = await createLeadPostHandler(submitLead)(request(validPayload));
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ success: false, code: "SUBMISSION_ERROR" });
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("does not call persistence in portfolio mode", async () => {
    let called = false;
    const handler = createLeadPostHandler(async () => { called = true; }, true);
    const response = await handler(request(validPayload));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ success: false, code: "SUBMISSION_ERROR" });
    expect(called).toBe(false);
  });
});
