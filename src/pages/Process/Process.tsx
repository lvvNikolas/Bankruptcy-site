type Props = { withHead?: boolean };
import styles from "./Process.module.css";

export default function Process({ withHead = true }: Props) {
  return (
    <section id="process" className={`${styles.wrap} section`}>
      {withHead && (
        <>
          <title>Процедура и сроки банкротства</title>
          <meta name="description" content="Пошагово: подготовка, подача, рассмотрение, списание долгов." />
        </>
      )}
      <div className="container">
        <h1 className="sectionHead">Как проходит процедура</h1>
        <p className="sectionLead">Мы сопровождаем каждый этап: от первичной диагностики до полного списания долгов.</p>

        <div className={styles.timeline}>
          <div className={styles.step}>
            <div className={styles.badge}>1</div>
            <h3 className={styles.title}>Диагностика и сбор документов</h3>
            <p className={styles.desc}>Проверяем основания, перечень кредиторов, активов, обязательств.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.badge}>2</div>
            <h3 className={styles.title}>Подача заявления</h3>
            <p className={styles.desc}>Готовим комплект и подаём в суд или МФЦ (при внесудебной процедуре).</p>
          </div>
          <div className={styles.step}>
            <div className={styles.badge}>3</div>
            <h3 className={styles.title}>Рассмотрение и взаимодействие</h3>
            <p className={styles.desc}>Представительство в процессе, запросы, коммуникация с кредиторами.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.badge}>4</div>
            <h3 className={styles.title}>Завершение процедуры</h3>
            <p className={styles.desc}>Списание обязательств и рекомендации по восстановлению кредитной истории.</p>
          </div>
        </div>
      </div>
    </section>
  );
}