import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculator" },
  title: "Калькулятор стоимости банкротства — рассчитайте онлайн",
  description:
    "Бесплатный калькулятор банкротства физических лиц. Введите сумму долга — узнайте стоимость процедуры и сроки списания долгов по 127-ФЗ за 1 минуту.",
  keywords: [
    "калькулятор банкротства",
    "стоимость банкротства физического лица",
    "сколько стоит банкротство",
    "сроки банкротства",
    "рассчитать банкротство онлайн",
    "банкротство 127-ФЗ цена",
  ],
  openGraph: {
    title: "Калькулятор стоимости банкротства | Юридическое агентство по банкротству Солюшен",
    description:
      "Рассчитайте стоимость банкротства физического лица за 1 минуту. Введите сумму долга — получите оценку расходов и сроков.",
    type: "website",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Калькулятор банкротства физических лиц",
    description: "Рассчитайте стоимость и сроки банкротства онлайн за 1 минуту.",
    images: ["/og-preview.jpg"],
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
