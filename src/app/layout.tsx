import type { Metadata } from "next";
import "@styles/globals.css";

import Navbar from "@/app/components/sections/Navbar/Navbar";
import Footer from "@/app/components/sections/Footer/Footer";
import FloatingCTA from "@/app/components/widgets/FloatingCTA/FloatingCTA";
import ScrollTopButton from "@components/widgets/ScrollTopButton/ScrollTopButton";


/* ============================================================
   GLOBAL METADATA (SEO)
   ============================================================ */
export const metadata: Metadata = {
  title: {
    default: "Банкротство физических лиц — помощь по 127-ФЗ",
    template: "%s | Юридическая помощь по банкротству",
  },
  description:
    "Списываем долги законно по 127-ФЗ. Бесплатная консультация, прозрачные условия, гарантия результата. Работаем по всей России.",
  keywords: [
    "банкротство физических лиц",
    "списание долгов",
    "127-ФЗ",
    "юридическая помощь",
    "финансовая защита",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Банкротство физических лиц — помощь по 127-ФЗ",
    description:
      "Законно спишем долги. Работаем по всей России. Бесплатная консультация и сопровождение до результата.",
    url: "https://ваш-домен.ру",
    siteName: "Юридический центр «Компания»",
    images: [
      {
        url: "/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Банкротство физических лиц — помощь по 127-ФЗ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Банкротство физических лиц — помощь по 127-ФЗ",
    description: "Юридическая помощь по списанию долгов по 127-ФЗ.",
    images: ["/og-preview.jpg"],
  },
  metadataBase: new URL("https://ваш-домен.ру"),
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />

        <main id="main-content">{children}</main>

        <Footer />
        <FloatingCTA />
        <ScrollTopButton />
      </body>
    </html>
  );
}