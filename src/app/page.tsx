// src/app/page.tsx — главная страница (лендинг)
import Hero from "@components/sections/Hero/Hero";

import Services from "@components/sections/Services/Services";
import Process from "@components/sections/Process/Process";
import Prices from "@components/sections/Prices/Prices";
import FAQ from "@components/sections/FAQ/FAQ";
import Contacts from "@components/sections/Contacts/Contacts";
import Quiz from "@components/sections/Quiz/Quiz";
import Debts from "@components/sections/Debts/Debts";
import DebtsChats from "@components/sections/Debts/DebtsChats";
import DebtsCon from "@components/sections/Debts/DebtsCon";
import Results from "./components/sections/Results/Results";

export default function Home() {
  return (
    <>
      <Hero />
      <Debts withHead={false} />
      <DebtsChats />
      <DebtsCon />
      <Results />

      {/* <Services withHead={false} /> */}
      {/* <Process withHead={false} /> */}
      <Quiz/>
      {/* <Prices withHead={false} /> */}
      {/* <FAQ withHead={false} /> */}
      {/* <Contacts withHead={false} /> */}
    </>
  );
}