import {
  FaUniversity,
  FaCreditCard,
  FaMoneyBillWave,
  FaHome,
  FaCar,
  FaKey,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaBaby,
  FaSadTear,
  FaBriefcase,
  FaHeart,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import "@styles/Debts.css";

type Props = { withHead?: boolean };

export default function Debts({ withHead = true }: Props) {
  return (
    <section id="debts" className="debts section" aria-labelledby="debts-title">
      <div className="container debts__container">
        {/* Центрированный мощный заголовок */}
        <header className="debts__head">
          <h2 id="debts-title" className="debts__title">
            Какие долги можно<br />
            <span className="debts__accent">списать</span>, а какие — нет?
          </h2>

          {withHead && (
            <p className="debts__lead">
              Наглядная памятка: что действительно попадает под списание при банкротстве, а что — нет.
            </p>
          )}
        </header>

        <div className="debts__grid">
          {/* МОЖНО СПИСАТЬ */}
          <section aria-labelledby="debts-allowed" className="debts__col">
            <div className="debts__colHead">
              <h3 id="debts-allowed" className="debts__colTitle debts__colTitle--ok">
                Можно списать
              </h3>
              <i className="debts__lock debts__lock--ok" aria-hidden>
                <FaLockOpen />
              </i>
            </div>

            <ul className="debts__chips" aria-label="Перечень долгов, которые можно списать">
              <li className="debts__chip"><span className="debts__ico"><FaUniversity /></span> Потребительские кредиты</li>
              <li className="debts__chip"><span className="debts__ico"><FaCreditCard /></span> Кредитные карты</li>
              <li className="debts__chip"><span className="debts__ico"><FaMoneyBillWave /></span> Микрозаймы</li>
              <li className="debts__chip"><span className="debts__ico"><FaHome /></span> ЖКХ</li>
              <li className="debts__chip"><span className="debts__ico"><FaCar /></span> Автокредит</li>
              <li className="debts__chip"><span className="debts__ico"><FaKey /></span> Ипотека</li>
              <li className="debts__chip"><span className="debts__ico"><FaFileInvoiceDollar /></span> Штрафы</li>
              <li className="debts__chip"><span className="debts__ico"><FaFileAlt /></span> Налоги</li>
            </ul>
          </section>

          {/* НЕЛЬЗЯ СПИСАТЬ */}
          <section aria-labelledby="debts-forbidden" className="debts__col">
            <div className="debts__colHead">
              <h3 id="debts-forbidden" className="debts__colTitle debts__colTitle--no">
                Нельзя списать
              </h3>
              <i className="debts__lock" aria-hidden>
                <FaLock />
              </i>
            </div>

            <ul className="debts__chips debts__chips--disabled" aria-label="Перечень долгов, которые списать нельзя">
              <li className="debts__chip"><span className="debts__ico"><FaBaby /></span> Алименты</li>
              <li className="debts__chip"><span className="debts__ico"><FaSadTear /></span> Моральный вред</li>
              <li className="debts__chip" title="Ответственность руководителей/участников по долгам компании">
                <span className="debts__ico"><FaBriefcase /></span> Субсидиарная ответственность
              </li>
              <li className="debts__chip"><span className="debts__ico"><FaHeart /></span> Вред здоровью</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}