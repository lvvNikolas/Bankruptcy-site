// src/app/page.tsx — главная (лендинг)
import type { Metadata } from "next";
import LeadForm from "@components/LeadForm/LeadForm";

// Секции как компоненты
// import Services   from "@components/sections/Services/Services";
// import Process    from "@components/sections/Process/Process";
// import Prices     from "@components/sections/Prices/Prices";
// import FAQ        from "@components/sections/FAQ/FAQ";
// import Contacts   from "@components/sections/Contacts/Contacts";
// import Quiz       from "@components/sections/Quiz/Quiz";
import Debts      from "@components/sections/Debts/Debts";
import DebtsChat  from "@components/sections/Debts/DebtsChat";

export const metadata: Metadata = {
  title: "Банкротство физических лиц — помощь по 127-ФЗ",
  description:
    "Законно спишем долги. Бесплатная консультация. Прозрачная цена. Работаем по всей РФ."
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section home-hero">
        <div className="container">
          <h1 className="sectionHead">Списание долгов законно и безопасно</h1>
          <p className="sectionLead home-sub">
            Сопровождаем судебную и внесудебную процедуру банкротства. Бесплатная первичная консультация.
          </p>
          <div className="home-cta">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Блоки «Долги» и «Диалог» */}
      <Debts withHead={false} />
      <DebtsChat withHead={false} />

      {/*
      <Services withHead={false} />
      <Process  withHead={false} />
      <Quiz     withHead={false} />
      <Prices   withHead={false} />
      <FAQ      withHead={false} />
      <Contacts withHead={false} />
      */}
    </>
  );
}