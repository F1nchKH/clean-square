import { expect, test } from "@playwright/test";

const liveMode = process.env.SITE_MODE === "live";

test("validates fields and calculation before sending", async ({ page }) => {
  test.skip(!liveMode, "Portfolio mode is active");
  let sent = 0;
  await page.route("**/api/leads", async (route) => {
    sent += 1;
    await route.fulfill({ status: 201, contentType: "application/json", body: '{"success":true}' });
  });
  await page.goto("/#lead");
  const lead = page.getByRole("region", { name: "Заявка" });
  await lead.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(lead.getByText(/Укажите имя/)).toBeVisible();
  await expect(lead.getByText(/Укажите телефон/)).toBeVisible();
  await expect(lead.getByText(/согласие/)).toBeVisible();
  expect(sent).toBe(0);

  await lead.getByRole("textbox", { name: "Ваше имя" }).fill("  Анна Иванова  ");
  await lead.getByRole("textbox", { name: "Телефон" }).fill("+7 (999) 123-45-67");
  await lead.getByRole("checkbox", { name: /Согласен/ }).check();
  await page.getByRole("spinbutton", { name: "Площадь, м²" }).fill("10.5");
  await lead.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(lead.getByText(/площадь целым числом/)).toBeVisible();
  expect(sent).toBe(0);
});

test("shows submitting and success with the current calculation", async ({ page }) => {
  test.skip(!liveMode, "Portfolio mode is active");
  let complete: (() => void) | undefined;
  const pending = new Promise<void>((resolve) => { complete = resolve; });
  let payload: unknown;
  let requests = 0;
  await page.route("**/api/leads", async (route) => {
    requests += 1;
    payload = route.request().postDataJSON();
    await pending;
    await route.fulfill({ status: 201, contentType: "application/json", body: '{"success":true}' });
  });
  await page.goto("/#calculator");
  await page.getByRole("spinbutton", { name: "Площадь, м²" }).fill("100");
  await page.getByRole("checkbox", { name: "Мытьё окон" }).check();
  await page.getByRole("region", { name: "Калькулятор уборки" })
    .getByRole("link", { name: "Перейти к заявке" }).click();
  const lead = page.getByRole("region", { name: "Заявка" });
  await expect(lead.getByTestId("estimated-price")).toHaveText("6 000 ₽");
  await lead.getByRole("textbox", { name: "Ваше имя" }).fill(" Анна ");
  await lead.getByRole("textbox", { name: "Телефон" }).fill("+7 999 123-45-67");
  await lead.getByRole("checkbox", { name: /Согласен/ }).check();
  await lead.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(lead.getByRole("button", { name: "Отправляем…" })).toBeDisabled();
  await lead.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit());
  expect(requests).toBe(1);
  expect(payload).toEqual({ name: "Анна", phone: "+7 999 123-45-67", consent: true, cleaningType: "maintenance", area: 100, addOns: ["windows"] });
  complete?.();
  await expect(lead.getByText("Заявка отправлена")).toBeVisible();
});

test("keeps form and calculation after a failed request, then retries", async ({ page }) => {
  test.skip(!liveMode, "Portfolio mode is active");
  let attempts = 0;
  await page.route("**/api/leads", async (route) => {
    attempts += 1;
    await route.fulfill({ status: attempts === 1 ? 500 : 201, contentType: "application/json", body: attempts === 1 ? '{"success":false,"code":"SUBMISSION_ERROR"}' : '{"success":true}' });
  });
  await page.goto("/#lead");
  const lead = page.getByRole("region", { name: "Заявка" });
  await lead.getByRole("textbox", { name: "Ваше имя" }).fill("Анна");
  await lead.getByRole("textbox", { name: "Телефон" }).fill("79991234567");
  await lead.getByRole("checkbox", { name: /Согласен/ }).check();
  await lead.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(lead.getByText(/Не удалось отправить заявку/)).toBeVisible();
  await expect(lead.getByRole("textbox", { name: "Ваше имя" })).toHaveValue("Анна");
  await expect(lead.getByRole("textbox", { name: "Телефон" })).toHaveValue("79991234567");
  await expect(lead.getByTestId("estimated-price")).toHaveText("2 500 ₽");
  await lead.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(lead.getByText("Заявка отправлена")).toBeVisible();
  expect(attempts).toBe(2);
});

test("portfolio form shows a demo notice without sending personal data", async ({ page }) => {
  test.skip(liveMode, "Live mode is active");
  let sent = 0;
  await page.route("**/api/leads", async (route) => {
    sent += 1;
    await route.abort();
  });
  await page.goto("/#lead");
  const lead = page.getByRole("region", { name: "Заявка" });
  await expect(lead.getByText(/Данные не отправляются/)).toBeVisible();
  await lead.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(lead.getByRole("status")).toContainText("Демо");
  expect(sent).toBe(0);
});

for (const width of [320, 390, 1280]) {
  test(`lead form stays usable without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/#lead");
    const lead = page.getByRole("region", { name: "Заявка" });
    await expect(lead.getByRole("textbox", { name: "Ваше имя" })).toBeVisible();
    await expect(lead.getByRole("button", { name: "Отправить заявку" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("form controls can be reached with keyboard and reloads without hydration errors", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (/hydration|did not match|server rendered html/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    if (/hydration|did not match|server rendered html/i.test(error.message)) {
      hydrationErrors.push(error.message);
    }
  });
  await page.goto("/#lead");
  await page.reload();
  const lead = page.getByRole("region", { name: "Заявка" });
  await lead.getByRole("textbox", { name: "Ваше имя" }).focus();
  await expect(lead.getByRole("textbox", { name: "Ваше имя" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(lead.getByRole("textbox", { name: "Телефон" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(lead.getByRole("checkbox", { name: liveMode ? /Согласен/ : /Согласие на обработку данных/ })).toBeFocused();
  await page.getByRole("spinbutton", { name: "Площадь, м²" }).fill("80");
  await expect(lead.getByTestId("estimated-price")).toHaveText("3 600 ₽");
  expect(hydrationErrors).toEqual([]);
});
