function publicContact(value: string | undefined): string | null {
  return value?.trim() || null;
}

export const siteContacts = {
  phone: publicContact(process.env.NEXT_PUBLIC_PHONE),
  telegramUrl: publicContact(process.env.NEXT_PUBLIC_TELEGRAM_URL),
  maxUrl: publicContact(process.env.NEXT_PUBLIC_MAX_URL),
};

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
