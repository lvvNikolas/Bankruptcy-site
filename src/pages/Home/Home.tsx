import LeadForm from "@features/LeadForm/LeadForm";
import Services from "@pages/Services/Services";
import Process from "@pages/Process/Process";
import Prices from "@pages/Prices/Prices";
import FAQ from "@pages/FAQ/FAQ";
import Contacts from "@pages/Contacts/Contacts";
import Quiz from "@pages/Quiz/Quiz";
import Debts from "../Debts/Debts";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <title>Банкротство физических лиц — помощь по 127-ФЗ</title>
        <meta
          name="description"
          content="Законно спишем долги. Бесплатная консультация. Прозрачная цена. Работаем по всей РФ."
        />
        <div className="container">
          <h1>Списание долгов законно и безопасно</h1>
          <p className={styles.sub}>
            Сопровождаем судебную и внесудебную процедуру банкротства. Бесплатная
            первичная консультация.
          </p>
          <div className={styles.cta}>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* те же страницы как секции лендинга — без <title>/<meta> */}
      <Services withHead={false} />
      <Debts withHead={false} />
      <Process withHead={false} />
      <Quiz   withHead={false} />
      <Prices withHead={false} />
      <FAQ withHead={false} />
      <Contacts withHead={false} />
    </>
  );
}