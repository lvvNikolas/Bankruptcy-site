// src/app/layout.tsx
import type { Metadata } from "next";
import "@styles/globals.css";

// используем корректные алиасы и названия
import Navbar from "@/app/components/sections/Navbar/Navbar";
import Footer from "@/app/components/sections/Footer/Footer";
import FloatingCTA from "@/app/components/widgets/FloatingCTA/FloatingCTA";

export const metadata: Metadata = {
  title: "Банкротство физических лиц — помощь по 127-ФЗ",
  description:
    "Законно спишем долги. Бесплатная консультация. Работаем по всей России.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}