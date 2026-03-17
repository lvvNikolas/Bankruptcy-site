import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculator" },
  title: "Калькулятор стоимости банкротства",
  description:
    "Рассчитайте стоимость банкротства физического лица онлайн. Введите сумму долга — получите оценку расходов и сроков процедуры.",
  openGraph: {
    title: "Калькулятор стоимости банкротства | Юридическое агентство по банкротству Солюшен",
    description:
      "Рассчитайте стоимость банкротства физического лица онлайн. Введите сумму долга — получите оценку расходов и сроков.",
    type: "website",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
