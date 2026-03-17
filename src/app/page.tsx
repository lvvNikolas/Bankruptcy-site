import type { Metadata } from "next";
import Hero from "@/app/components/sections/Hero/Hero";
import Quiz from "@/app/components/sections/Quiz/Quiz";
import Debts from "@/app/components/sections/Debts/Debts";
import DebtsChats from "@/app/components/sections/Debts/DebtsChats";
import DebtsCon from "@/app/components/sections/Debts/DebtsCon";
import Results from "@/app/components/sections/Results/Results";
import CasesSection from "@/app/components/sections/Cases/CasesSection";
import CtaSection from "@/app/components/sections/Cta/CtaSection";
import ReviewsSection from "@/app/components/sections/ReviewsSection/ReviewsSection";
import CalcPreview from "@/app/components/sections/CalcPreview/CalcPreview";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: {
    absolute: "Юридическое агентство по банкротству Солюшен — банкротство физических лиц по 127-ФЗ",
  },
  description:
    "Законно спишем долги по 127-ФЗ. Бесплатная консультация, прозрачные условия, сопровождение до результата. Работаем по всей России.",
  keywords: [
    "банкротство физических лиц",
    "списать долги",
    "127-ФЗ банкротство",
    "арбитражный управляющий",
    "банкротство Москва",
    "юрист по банкротству",
    "списание долгов через суд",
  ],
  openGraph: {
    type: "website",
    title: "Юридическое агентство по банкротству Солюшен — банкротство физических лиц по 127-ФЗ",
    description:
      "Законно спишем долги по 127-ФЗ. Бесплатная консультация, прозрачные условия, сопровождение до результата.",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630, alt: "Юридическое агентство по банкротству Солюшен — банкротство физических лиц" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Юридическое агентство по банкротству Солюшен — банкротство физических лиц по 127-ФЗ",
    description: "Законно спишем долги по 127-ФЗ. Бесплатная консультация.",
    images: ["/og-preview.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Debts withHead={false} />
      <DebtsChats />
      <DebtsCon />
      <Results />
      <CalcPreview />
      <Quiz />
      <CasesSection />
      <CtaSection />
      <ReviewsSection />
    </>
  );
}