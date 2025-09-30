// src/pages/Debts/Debts.tsx
import {
  FaUniversity, FaCreditCard, FaMoneyBillWave, FaHome,
  FaCar, FaKey, FaFileInvoiceDollar, FaFileAlt,
  FaBaby, FaSadTear, FaBriefcase, FaHeart
} from "react-icons/fa";
import styles from "./Debts.module.css";

type Props = { withHead?: boolean };

export default function Debts({ withHead = true }: Props) {
  return (
    <section id="debts" className={`${styles.section} section`}>
      <div className="container">
        {withHead && (
          <>
            <h2 className="sectionHead">
              Какие долги <span className={styles.red}>можно списать</span>, а какие — нет?
            </h2>
            <p className="sectionLead">
              Короткая памятка: что попадает под списание при банкротстве, а что — нет.
            </p>
          </>
        )}

        <div className={styles.grid}>
          {/* МОЖНО СПИСАТЬ */}
          <div>
            <div className={styles.titleRow}>
              <h3 className={`${styles.colTitle} ${styles.colOk}`}>
                Можно списать
              </h3>
              <span className={styles.lock} aria-hidden>🔓</span>
            </div>

            <ul className={styles.chips}>
              <li className={styles.chip}><span className={styles.ico}><FaUniversity/></span>Потребительские кредиты</li>
              <li className={styles.chip}><span className={styles.ico}><FaCreditCard/></span>Кредитные карты</li>
              <li className={styles.chip}><span className={styles.ico}><FaMoneyBillWave/></span>Микрозаймы</li>
              <li className={styles.chip}><span className={styles.ico}><FaHome/></span>ЖКХ</li>
              <li className={styles.chip}><span className={styles.ico}><FaCar/></span>Автокредит</li>
              <li className={styles.chip}><span className={styles.ico}><FaKey/></span>Ипотека</li>
              <li className={styles.chip}><span className={styles.ico}><FaFileInvoiceDollar/></span>Штрафы</li>
              <li className={styles.chip}><span className={styles.ico}><FaFileAlt/></span>Налоги</li>
            </ul>
          </div>

          {/* НЕЛЬЗЯ СПИСАТЬ */}
          <div>
            <div className={styles.titleRow}>
              <h3 className={`${styles.colTitle} ${styles.colNo}`}>
                Нельзя списать
              </h3>
              <span className={styles.lock} aria-hidden>🔒</span>
            </div>

            <ul className={`${styles.chips} ${styles.disabled}`}>
              <li className={styles.chip}><span className={styles.ico}><FaBaby/></span>Алименты</li>
              <li className={styles.chip}><span className={styles.ico}><FaSadTear/></span>Моральный вред</li>
              <li className={styles.chip}><span className={styles.ico}><FaBriefcase/></span>Субсидиарная ответственность</li>
              <li className={styles.chip}><span className={styles.ico}><FaHeart/></span>Вред здоровью</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}