import { expect, test } from "@playwright/test";

test("calculates every cleaning type, toggles add-ons, and keeps the result at the lead section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Рассчитать стоимость/ }).first().click();

  const calculator = page.getByRole("region", { name: "Калькулятор уборки" });
  const area = calculator.getByRole("spinbutton", { name: "Площадь, м²" });
  const price = calculator.getByTestId("estimated-price");
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "fetch" || request.resourceType() === "xhr") {
      requests.push(request.url());
    }
  });

  await expect(price).toHaveText("2 500 ₽");
  await calculator.getByRole("radio", { name: "Генеральная уборка" }).check();
  await expect(price).toHaveText("4 500 ₽");
  await calculator.getByRole("radio", { name: "Уборка после ремонта" }).check();
  await expect(price).toHaveText("6 000 ₽");
  await calculator.getByRole("radio", { name: "Поддерживающая уборка" }).check();
  await area.fill("100");
  await expect(price).toHaveText("4 500 ₽");

  await calculator.getByRole("checkbox", { name: "Мытьё окон" }).check();
  await expect(price).toHaveText("6 000 ₽");
  await calculator.getByRole("checkbox", { name: "Мытьё холодильника внутри" }).check();
  await expect(price).toHaveText("6 700 ₽");
  await calculator.getByRole("checkbox", { name: "Мытьё духовки внутри" }).check();
  await expect(price).toHaveText("7 400 ₽");
  await calculator.getByRole("checkbox", { name: "Мытьё окон" }).uncheck();
  await expect(price).toHaveText("5 900 ₽");

  await calculator.getByRole("link", { name: "Перейти к заявке" }).click();
  await expect(page).toHaveURL(/#lead$/);
  const lead = page.getByRole("region", { name: "Заявка" });
  await expect(lead.getByTestId("estimated-price")).toHaveText("5 900 ₽");
  await expect(lead.getByText("100 м²")).toBeVisible();
  expect(requests).toEqual([]);
});

test("invalid area hides a valid calculation and blocks the lead CTA", async ({ page }) => {
  await page.goto("/#calculator");
  const calculator = page.getByRole("region", { name: "Калькулятор уборки" });
  const area = calculator.getByRole("spinbutton", { name: "Площадь, м²" });

  for (const value of ["", "9", "501", "10.5"]) {
    await area.fill(value);
    await expect(area).toHaveAttribute("aria-invalid", "true");
    await expect(calculator.getByTestId("estimated-price")).toHaveCount(0);
    await expect(calculator.getByRole("link", { name: "Перейти к заявке" })).toHaveCount(0);
  }

  await area.fill("10");
  await expect(area).toHaveAttribute("aria-invalid", "false");
  await expect(calculator.getByTestId("estimated-price")).toHaveText("2 500 ₽");
  await area.fill("500");
  await expect(calculator.getByTestId("estimated-price")).toHaveText("22 500 ₽");
});

for (const width of [320, 390, 1280]) {
  test(`calculator remains usable without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/#calculator");
    const calculator = page.getByRole("region", { name: "Калькулятор уборки" });
    await calculator.getByRole("spinbutton", { name: "Площадь, м²" }).fill("80");
    await expect(calculator.getByTestId("estimated-price")).toHaveText("3 600 ₽");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(calculator.getByRole("link", { name: "Перейти к заявке" })).toBeVisible();
  });
}
