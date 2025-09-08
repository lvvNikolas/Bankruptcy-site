type Props = { withHead?: boolean };
import styles from "./Prices.module.css";

export default function Prices({ withHead = true }: Props) {
  return (
    <section id="ceny" className={`${styles.wrap} section`}>
      {withHead && (
        <>
          <title>Цены и рассрочка</title>
          <meta name="description" content="Фиксированная стоимость сопровождения, рассрочка и поэтапная оплата." />
        </>
      )}
      <div className="container">
        <h1 className="sectionHead">Тарифы</h1>
        <p className="sectionLead">Честные цены без скрытых платежей. Возможна рассрочка.</p>

        <div className={styles.grid}>
          <div className={styles.plan}>
            <h3>Старт</h3>
            <div className={styles.amount}>от 39 000 ₽</div>
            <p className={styles.note}>Первичный анализ, комплект документов, подача.</p>
            <div className={styles.cta}><button>Оставить заявку</button></div>
          </div>
          <div className={styles.plan}>
            <h3>Стандарт</h3>
            <div className={styles.amount}>от 79 000 ₽</div>
            <p className={styles.note}>Ведение дела, взаимодействие с кредиторами, представитель.</p>
            <div className={styles.cta}><button>Оставить заявку</button></div>
          </div>
          <div className={styles.plan}>
            <h3>Премиум</h3>
            <div className={styles.amount}>индивидуально</div>
            <p className={styles.note}>Сложные случаи, активы, оспаривание сделок, ускорение.</p>
            <div className={styles.cta}><button>Оставить заявку</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}