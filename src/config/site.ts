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
  "Сначала видите ориентир по цене, потом оставляете заявку.",
  "Средства и оборудование привезём с собой.",
  "Объём работ и удобное время обсудим заранее.",
  "Вопросы по результату можно обсудить после уборки.",
] as const;

export const howItWorksSteps = [
  "Выберите вид уборки, площадь и дополнения.",
  "Посмотрите расчёт и оставьте контакты.",
  "Уточним задачи, время и окончательную цену.",
  "Приедем и проведём уборку.",
] as const;

export const reviews: ReadonlyArray<{
  name: string;
  text: string;
  rating: number;
}> = [
  {
    name: "Анна",
    text: "После ремонта пыль была даже на верхних полках. К вечеру квартира снова стала пригодной для жизни.",
    rating: 5,
  },
  {
    name: "Михаил",
    text: "Сразу понял порядок цены. Потом уточнили, что нужно сделать с кухней, и согласовали время.",
    rating: 4,
  },
  {
    name: "Елена",
    text: "Наконец дошли руки до большой уборки. Больше всего порадовали кухня и ванная.",
    rating: 5,
  },
];
