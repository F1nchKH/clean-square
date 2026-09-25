import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clean-square.vercel.app"),
  title: "Clean Square — уборка квартир и домов",
  description:
    "Узнайте предварительную стоимость уборки квартиры или дома: выберите вид уборки, площадь и дополнительные услуги. Демонстрационный проект.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Clean Square — уборка квартир и домов",
    description:
      "Понятный расчёт уборки квартиры или дома — вид уборки, площадь и дополнительные услуги.",
    url: "/",
    siteName: "Clean Square",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/og-image.png", width: 1280, height: 640, alt: "Clean Square: уборка дома и расчёт стоимости" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clean Square — уборка квартир и домов",
    description: "Выберите вид уборки, площадь и дополнения, чтобы увидеть предварительную стоимость.",
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
