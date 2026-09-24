import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("public contact configuration", () => {
  it("exposes configured phone and secure contact destinations", async () => {
    vi.stubEnv("NEXT_PUBLIC_PHONE", " +7 999 123-45-67 ");
    vi.stubEnv("NEXT_PUBLIC_TELEGRAM_URL", "https://t.me/clean_square_e2e_fixture");
    vi.stubEnv("NEXT_PUBLIC_MAX_URL", "https://max.ru/clean_square_e2e_fixture");

    const { siteContacts } = await import("../../src/config/site");
    expect(siteContacts).toEqual({
      phone: "+7 999 123-45-67",
      telegramUrl: "https://t.me/clean_square_e2e_fixture",
      maxUrl: "https://max.ru/clean_square_e2e_fixture",
    });
  });

  it.each([
    "https://example.com/contact",
    "https://t.me/your-company",
    "https://max.ru/placeholder",
    "javascript:alert(1)",
    "http://t.me/contact",
    "not a URL",
  ])("does not expose placeholder or unsafe destination %s", async (url) => {
    vi.stubEnv("NEXT_PUBLIC_TELEGRAM_URL", url);
    vi.stubEnv("NEXT_PUBLIC_MAX_URL", url);

    const { siteContacts } = await import("../../src/config/site");
    expect(siteContacts.telegramUrl).toBeNull();
    expect(siteContacts.maxUrl).toBeNull();
  });
});
