import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clean-square.vercel.app"),
  title: "Clean Square — демо-сайт клининга с калькулятором",
  description:
    "Портфолио-проект: калькулятор предварительной стоимости уборки и форма заявки для вымышленной компании. Публичная версия не отправляет данные.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Clean Square — демо-сайт клининга с калькулятором",
    description:
      "Расчёт стоимости уборки, форма заявки и защищённый серверный путь для приватной демонстрации. Публичная версия не отправляет данные.",
    url: "/",
    siteName: "Clean Square",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/og-image.png", width: 1280, height: 640, alt: "Главный экран демо-сайта Clean Square" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clean Square — демо-сайт клининга с калькулятором",
    description: "Калькулятор уборки и демонстрация заявки без отправки данных в публичной версии.",
    images: ["/og-image.png"],
  },
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
