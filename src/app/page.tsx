import Hero from "@/app/components/sections/Hero/Hero";
import Quiz from "@/app/components/sections/Quiz/Quiz";
import Debts from "@/app/components/sections/Debts/Debts";
import DebtsChats from "@/app/components/sections/Debts/DebtsChats";
import DebtsCon from "@/app/components/sections/Debts/DebtsCon";
import Results from "@/app/components/sections/Results/Results";
import CasesSection from "@/app/components/sections/Cases/CasesSection";
import CtaSection from "@/app/components/sections/Cta/CtaSection";
import ReviewsSection from "@/app/components/sections/ReviewsSection/ReviewsSection";

export default function Home() {
  return (
    <>
      <Hero />

      <Debts withHead={false} />
      <DebtsChats />
      <DebtsCon />

      <Results />

      <Quiz />

      <CasesSection />

      <CtaSection />

      <ReviewsSection />
    </>
  );
}