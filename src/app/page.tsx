// src/app/page.tsx — главная страница (лендинг)
import LeadForm from "@components/LeadForm/LeadForm";

import Services from "@components/sections/Services/Services";
import Process from "@components/sections/Process/Process";
import Prices from "@components/sections/Prices/Prices";
import FAQ from "@components/sections/FAQ/FAQ";
import Contacts from "@components/sections/Contacts/Contacts";
import Quiz from "@components/sections/Quiz/Quiz";
import Debts from "@components/sections/Debts/Debts";
import DebtsChats from "@components/sections/Debts/DebtsChats";

export default function Home() {
  return (
    <>
      {/* Hero-секция */}
      <section className="section">
        <div className="container">
          <h1 className="sectionHead">Списание долгов законно и безопасно</h1>
          <p className="sectionLead">
            Сопровождаем судебную и внесудебную процедуру банкротства. Бесплатная первичная консультация.
          </p>
          <div className="leadFormWrapper">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Основные секции лендинга */}
      <Services withHead={false} />
      <Process withHead={false} />
      <Quiz withHead={false} />

      {/* Блок “Долги” + чат-секция */}
      <Debts withHead={false} />
      <DebtsChats />

      {/* Цены, FAQ, Контакты */}
      <Prices withHead={false} />
      <FAQ withHead={false} />
      <Contacts withHead={false} />
    </>
  );
}