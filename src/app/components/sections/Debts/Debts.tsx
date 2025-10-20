// src/app/components/sections/Debts/Debts.tsx
import {
  FaUniversity, FaCreditCard, FaMoneyBillWave, FaHome,
  FaCar, FaKey, FaFileInvoiceDollar, FaFileAlt,
  FaBaby, FaSadTear, FaBriefcase, FaHeart
} from "react-icons/fa";
import "@styles/Debts.css";

type Props = { withHead?: boolean }; // оставим для совместимости

export default function Debts({ withHead = true }: Props) {
  return (
    <section id="debts" className="section debts-section" aria-labelledby="debts-title">
      {/* Фон секции (сплошной), без градиентов/теней */}
      <div className="debts-backdrop" aria-hidden />

      <div className="container">
        <header className="debts-hero">
          <h2 id="debts-title" className="debts-heroTitle">
            Какие долги <span className="debts-accent">можно списать</span>, а какие — нет?
          </h2>
          <p className="debts-heroLead">
            Короткая памятка: что попадает под списание при банкротстве, а что — нет.
          </p>
        </header>

        <div className="debts-grid">
          {/* МОЖНО СПИСАТЬ */}
          <section aria-labelledby="debts-allowed-title">
            <div className="debts-titleRow">
              <h3 id="debts-allowed-title" className="debts-colTitle debts-colOk">
                Можно списать
              </h3>
              <span className="debts-lock" aria-hidden>🔓</span>
            </div>

            <ul className="debts-chips">
              <li className="debts-chip"><span className="debts-ico"><FaUniversity/></span>Потребительские кредиты</li>
              <li className="debts-chip"><span className="debts-ico"><FaCreditCard/></span>Кредитные карты</li>
              <li className="debts-chip"><span className="debts-ico"><FaMoneyBillWave/></span>Микрозаймы</li>
              <li className="debts-chip"><span className="debts-ico"><FaHome/></span>ЖКХ</li>
              <li className="debts-chip"><span className="debts-ico"><FaCar/></span>Автокредит</li>
              <li className="debts-chip"><span className="debts-ico"><FaKey/></span>Ипотека</li>
              <li className="debts-chip"><span className="debts-ico"><FaFileInvoiceDollar/></span>Штрафы</li>
              <li className="debts-chip"><span className="debts-ico"><FaFileAlt/></span>Налоги</li>
            </ul>
          </section>

          {/* НЕЛЬЗЯ СПИСАТЬ */}
          <section aria-labelledby="debts-forbidden-title">
            <div className="debts-titleRow">
              <h3 id="debts-forbidden-title" className="debts-colTitle debts-colNo">
                Нельзя списать
              </h3>
              <span className="debts-lock" aria-hidden>🔒</span>
            </div>

            <ul className="debts-chips debts-disabled">
              <li className="debts-chip"><span className="debts-ico"><FaBaby/></span>Алименты</li>
              <li className="debts-chip"><span className="debts-ico"><FaSadTear/></span>Моральный вред</li>
              <li className="debts-chip" title="Ответственность руководителей/участников по долгам компании">
                <span className="debts-ico"><FaBriefcase/></span>Субсидиарная ответственность
              </li>
              <li className="debts-chip"><span className="debts-ico"><FaHeart/></span>Вред здоровью</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}