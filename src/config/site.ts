function publicPhone(value: string | undefined): string | null {
  const phone = value?.trim();
  const digits = phone?.replace(/\D/g, "") ?? "";
  return phone && /^[+\d\s()-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15
    ? phone
    : null;
}

function publicContactUrl(value: string | undefined): string | null {
  const url = value?.trim();
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      /(^|\.)example\.(com|org|net)$/.test(parsed.hostname) ||
      /(^|[\/._-])(placeholder|your-company)([\/._-]|$)/i.test(parsed.pathname)
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export const siteContacts = {
  phone: publicPhone(process.env.NEXT_PUBLIC_PHONE),
  telegramUrl: publicContactUrl(process.env.NEXT_PUBLIC_TELEGRAM_URL),
  maxUrl: publicContactUrl(process.env.NEXT_PUBLIC_MAX_URL),
};

export const siteMode = process.env.SITE_MODE === "live" ? "live" : "portfolio";

export const benefits = [
  "Ориентировочная стоимость видна до звонка.",
  "Привозим чистящие средства и оборудование.",
  "Согласовываем удобное время уборки.",
  "Если заметите недочёт, вернёмся и исправим.",
] as const;

export const howItWorksSteps = [
  "Рассчитайте ориентировочную стоимость.",
  "Отправьте заявку.",
  "Мы уточним детали и согласуем время.",
  "Проведём уборку.",
] as const;

export const reviews: ReadonlyArray<{
  name: string;
  text: string;
  rating: number;
}> = [
  {
    name: "Анна",
    text: "После ремонта осталось много пыли. Команда убрала квартиру аккуратно и в согласованное время.",
    rating: 5,
  },
  {
    name: "Михаил",
    text: "Удобно, что примерную стоимость можно увидеть заранее. Итоговые детали обсудили перед уборкой.",
    rating: 5,
  },
  {
    name: "Елена",
    text: "Заказывала генеральную уборку. Квартира стала заметно чище, особенно кухня.",
    rating: 5,
  },
];
