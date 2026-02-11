
import Hero from "@components/sections/Hero/Hero";
import Quiz from "@components/sections/Quiz/Quiz";
import Debts from "@components/sections/Debts/Debts";
import DebtsChats from "@components/sections/Debts/DebtsChats";
import DebtsCon from "@components/sections/Debts/DebtsCon";
import Results from "./components/sections/Results/Results";
import CasesSection from "./components/sections/Cases/CasesSection";
import Cta from "@components/sections/Cta/CtaSection";
import ReviewsSection from "./components/sections/ReviewsSection/ReviewsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Debts withHead={false} />
      <DebtsChats />
      <DebtsCon />
      <Results />
      <Quiz/>
      <CasesSection />
      <Cta />
      <ReviewsSection />
    </>
  );
}