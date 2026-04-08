import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Личный кабинет — Банкротство Солюшен",
  description: "Отслеживайте статус вашего дела о банкротстве",
  robots: "noindex, nofollow", // кабинет не индексируем
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
