import { createServer, type Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { createLeadPostHandler } from "../../src/app/api/leads/route";
import { submitLead } from "../../src/server/leads";

const livePost = createLeadPostHandler(submitLead);

const originalUrl = process.env.SUPABASE_URL;
const originalKey = process.env.SUPABASE_SECRET_KEY;
let server: Server | undefined;

afterEach(async () => {
  if (originalUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
  else process.env.SUPABASE_SECRET_KEY = originalKey;
  if (server) await new Promise<void>((resolve) => server?.close(() => resolve()));
  server = undefined;
});

function leadRequest(): Request {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "  Anna  ",
      phone: " +7 999 123-45-67 ",
      cleaningType: "deep",
      area: 54,
      addOns: ["windows", "fridge"],
      consent: true,
      calculatedPrice: 1,
    }),
  });
}

async function fakeSupabase(statuses: number[]) {
  const writes: Array<{ method: string; path: string; body: unknown }> = [];
  server = createServer(async (request, response) => {
    let raw = "";
    for await (const part of request) raw += part.toString();
    writes.push({
      method: request.method ?? "",
      path: request.url ?? "",
      body: JSON.parse(raw),
    });
    const status = statuses.shift() ?? 201;
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(status === 201 ? "" : '{"message":"private database detail"}');
  });
  await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No test address");
  process.env.SUPABASE_URL = `http://127.0.0.1:${address.port}`;
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test_only";
  return writes;
}

describe("Supabase lead persistence", () => {
  it("inserts one normalized row with the server price", async () => {
    const writes = await fakeSupabase([201]);
    const response = await livePost(leadRequest());

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ success: true });
    expect(writes).toEqual([{
      method: "POST",
      path: "/rest/v1/leads",
      body: {
        name: "Anna",
        phone: "+7 999 123-45-67",
        cleaning_type: "deep",
        area: 54,
        add_ons: ["windows", "fridge"],
        calculated_price: 7060,
        consent: true,
      },
    }]);
  });

  it("normalizes a database failure and allows retry", async () => {
    const writes = await fakeSupabase([500, 201]);
    const failed = await livePost(leadRequest());
    const failedBody = await failed.text();
    expect(failed.status).toBe(500);
    expect(JSON.parse(failedBody)).toEqual({ success: false, code: "SUBMISSION_ERROR" });
    expect(failedBody).not.toContain("private database detail");

    const retried = await livePost(leadRequest());
    expect(retried.status).toBe(201);
    expect(writes).toHaveLength(2);
  });

  it("rejects a non-secret key before any database request", async () => {
    const writes = await fakeSupabase([201]);
    process.env.SUPABASE_SECRET_KEY = "sb_publishable_test_only";

    const response = await livePost(leadRequest());
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ success: false, code: "SUBMISSION_ERROR" });
    expect(writes).toHaveLength(0);
  });
});
