import { expect, test } from "@playwright/test";

const configuredTelegram = process.env.NEXT_PUBLIC_TELEGRAM_URL;
const configuredMax = process.env.NEXT_PUBLIC_MAX_URL;
const configuredPhone = process.env.NEXT_PUBLIC_PHONE;
const liveMode = process.env.SITE_MODE === "live";

test("contact paths open the configured destinations", async ({ page, context }) => {
  test.skip(!liveMode || !configuredTelegram || !configuredMax, "Live contact destinations are unavailable");

  await page.goto("/#lead");
  const lead = page.getByRole("region", { name: "Заявка" });
  const footer = page.locator("footer.site-footer");

  for (const section of [lead, footer]) {
    const telegram = section.getByRole("link", { name: "Telegram" });
    const max = section.getByRole("link", { name: "MAX" });
    await expect(telegram).toHaveAttribute("href", configuredTelegram!);
    await expect(max).toHaveAttribute("href", configuredMax!);
    await expect(telegram).toHaveAttribute("target", "_blank");
    await expect(max).toHaveAttribute("target", "_blank");
    await expect(telegram).toHaveAttribute("rel", /noopener/);
    await expect(max).toHaveAttribute("rel", /noopener/);
  }
  if (configuredPhone) {
    await expect(footer.getByRole("link", { name: configuredPhone })).toHaveAttribute("href", /^tel:/);
  } else {
    await expect(footer.getByRole("link", { name: /^\+?\d/ })).toHaveCount(0);
    await expect(footer).not.toContainText("Телефон будет добавлен");
  }

  await context.route(configuredTelegram!, (route) => route.fulfill({ body: "Telegram contact test" }));
  await context.route(configuredMax!, (route) => route.fulfill({ body: "MAX contact test" }));
  for (const [name, destination] of [["Telegram", configuredTelegram!], ["MAX", configuredMax!]] as const) {
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      lead.getByRole("link", { name }).click(),
    ]);
    await expect(popup).toHaveURL(destination);
    await popup.close();
  }

  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(lead.getByRole("link", { name: "Telegram" })).toBeVisible();
    await expect(lead.getByRole("link", { name: "MAX" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test("unconfigured contacts are not presented as working links", async ({ page }) => {
  test.skip(!liveMode || Boolean(configuredTelegram || configuredMax || configuredPhone), "Live contacts are configured or portfolio mode is active");

  await page.goto("/#lead");
  const lead = page.getByRole("region", { name: "Заявка" });
  const footer = page.locator("footer.site-footer");
  await expect(lead.getByRole("link", { name: "Telegram" })).toHaveCount(0);
  await expect(lead.getByRole("link", { name: "MAX" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "Telegram" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "MAX" })).toHaveCount(0);
  await expect(lead.getByText("Контакты для переписки пока не настроены.")).toBeVisible();
});

test("portfolio contact buttons stay on the site and show a demo notice", async ({ page }) => {
  test.skip(liveMode, "Live mode is active");

  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/#lead");
    const lead = page.getByRole("region", { name: "Заявка" });
    const footer = page.locator("footer.site-footer");
    await expect(page.locator('a[href^="http"]')).toHaveCount(0);
    for (const section of [lead, footer]) {
      await expect(section.getByRole("link", { name: "Telegram" })).toHaveCount(0);
      await expect(section.getByRole("link", { name: "MAX" })).toHaveCount(0);
      await section.getByRole("button", { name: "Telegram" }).click();
      await expect(section.getByRole("status")).toContainText("Демо");
      await section.getByRole("button", { name: "MAX" }).click();
      await expect(section.getByRole("status")).toContainText("MAX");
    }
    await expect(page).toHaveURL(/#lead$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
