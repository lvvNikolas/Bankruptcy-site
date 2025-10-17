// src/app/layout.tsx
import type { Metadata } from "next";
import "@styles/globals.css";

import Header from "@components/sections/Header/Header";
import Footer from "@components/sections/Footer/Footer";
import FloatingCTA from "@components/widgets/FloatingCTA/FloatingCTA";

export const metadata: Metadata = {
  title: "Банкротство физических лиц — помощь по 127-ФЗ",
  description:
    "Законно спишем долги. Бесплатная консультация. Работаем по всей России."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}