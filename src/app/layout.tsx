import type { Metadata } from "next";
import "@styles/globals.css";

import Navbar from "@/app/components/sections/Navbar/Navbar";
import Footer from "@/app/components/sections/Footer/Footer";
import FloatingCTA from "@/app/components/widgets/FloatingCTA/FloatingCTA";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = "https://basolution.ru"; // ← поменяй если другой домен
const SITE_NAME = "BASolution";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Банкротство физических лиц — помощь по 127-ФЗ",
    template: "%s | Банкротство физических лиц",
  },

  description:
    "Списываем долги законно по 127-ФЗ. Бесплатная консультация, прозрачные условия, сопровождение до результата. Работаем по всей России.",

  keywords: [
    "банкротство физических лиц",
    "списание долгов",
    "127-ФЗ",
    "юрист по банкротству",
    "финансовая защита",
  ],

  // ✅ Фавиконки (работает с app/icon.png или public/favicon.png)
  icons: {
    icon: [
      { url: "/favicon.ico" }, // если добавишь .ico — ок
      { url: "/favicon.png" }, // твой текущий вариант
    ],
    apple: [{ url: "/apple-touch-icon.png" }], // если добавишь
  },

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Банкротство физических лиц — помощь по 127-ФЗ",
    description:
      "Законно спишем долги. Бесплатная консультация и сопровождение до результата. Работаем по всей России.",
    images: [
      {
        url: "/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "BASolution — банкротство физических лиц",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Банкротство физических лиц — помощь по 127-ФЗ",
    description:
      "Юридическая помощь по списанию долгов по 127-ФЗ. Бесплатная консультация.",
    images: ["/og-preview.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}