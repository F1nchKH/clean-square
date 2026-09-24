import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

test("private live flow persists the server price in Supabase", async ({ page }) => {
  test.skip(
    process.env.SITE_MODE !== "live" || process.env.RUN_LIVE_INTEGRATION !== "1",
    "Private live integration check is not enabled",
  );

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key?.startsWith("sb_secret_")) {
    throw new Error("Private Supabase credentials are required for this check");
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const name = `Synthetic Clean Square ${Date.now()}`;
  const phone = "+70000000000";
  let insertedId: string | undefined;

  try {
    await page.goto("/");
    await page.getByRole("link", { name: /Рассчитать стоимость/ }).first().click();
    const calculator = page.getByRole("region", { name: "Калькулятор уборки" });
    await calculator.getByRole("radio", { name: "Генеральная уборка" }).check();
    await calculator.getByRole("spinbutton", { name: "Площадь, м²" }).fill("54");
    await calculator.getByRole("checkbox", { name: "Мытьё окон" }).check();
    await calculator.getByRole("checkbox", { name: "Мытьё холодильника внутри" }).check();
    await expect(calculator.getByTestId("estimated-price")).toHaveText("7 060 ₽");
    await calculator.getByRole("link", { name: "Перейти к заявке" }).click();

    const lead = page.getByRole("region", { name: "Заявка" });
    await lead.getByRole("textbox", { name: "Ваше имя" }).fill(name);
    await lead.getByRole("textbox", { name: "Телефон" }).fill(phone);
    await lead.getByRole("checkbox", { name: /Согласен/ }).check();
    await lead.getByRole("button", { name: "Отправить заявку" }).click();
    await expect(lead.getByText("Заявка отправлена")).toBeVisible();

    const { data, error } = await supabase.from("leads")
      .select("id, cleaning_type, area, add_ons, calculated_price, consent, created_at")
      .eq("name", name).eq("phone", phone);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    insertedId = data?.[0]?.id;
    expect(data?.[0]).toMatchObject({
      cleaning_type: "deep",
      area: 54,
      add_ons: ["windows", "fridge"],
      calculated_price: 7060,
      consent: true,
    });
    expect(data?.[0]?.created_at).toBeTruthy();
  } finally {
    if (insertedId) {
      const { error } = await supabase.from("leads").delete().eq("id", insertedId);
      expect(error).toBeNull();
      const { data, error: readError } = await supabase.from("leads").select("id").eq("id", insertedId);
      expect(readError).toBeNull();
      expect(data).toHaveLength(0);
    }
  }
});
