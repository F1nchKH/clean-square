import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clean Square — уборка квартир и домов",
  description:
    "Поддерживающая, генеральная и уборка после ремонта. Рассчитайте ориентировочную стоимость уборки и оставьте заявку.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
