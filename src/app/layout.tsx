import type { Metadata } from "next";
import { Literata, Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({ subsets: ["cyrillic", "latin"], variable: "--font-onest", display: "swap" });
const literata = Literata({ subsets: ["cyrillic", "latin"], style: ["normal", "italic"], variable: "--font-literata", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://clean-square.vercel.app"),
  title: "Clean Square — уборка квартир и домов",
  description:
    "Чистый дом начинается с понятной цены. Рассчитайте предварительную стоимость уборки квартиры или дома. Демонстрационный проект.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Clean Square — уборка квартир и домов",
    description:
      "Выберите вид уборки, площадь и дополнения — предварительную стоимость покажем сразу.",
    url: "/",
    siteName: "Clean Square",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/og-image.png", width: 1280, height: 640, alt: "Clean Square: чистый дом начинается с понятной цены" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clean Square — уборка квартир и домов",
    description: "Чистый дом начинается с понятной цены. Рассчитайте стоимость уборки за несколько шагов.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${onest.variable} ${literata.variable}`}>{children}</body>
    </html>
  );
}
