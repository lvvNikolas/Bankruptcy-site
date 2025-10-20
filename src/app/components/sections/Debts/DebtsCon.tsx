"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "@styles/DebtsCon.css";
import LeadForm from "@components/LeadForm/LeadForm";

export default function DebtsCon() {
  const [open, setOpen] = useState(false);

  // Закрытие по ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <section id="debts-con" className="debtsCon section" aria-labelledby="debtsCon-title">
        <div className="container">
          <header className="debtsCon__head debtsCon__head--center">
            <h2 id="debtsCon-title" className="debtsCon__title">
              Последствия после банкротства
            </h2>
            <p className="debtsCon__subtitle">
              Краткие ограничения после процедуры банкротства
            </p>
          </header>

          {/* Карточки */}
          <div className="debtsCon__grid">
            {/* 1 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">5 лет</h3>
                <p>Нельзя повторно заявить о банкротстве.</p>
                <p>Нужно сообщать о банкротстве при подаче заявки на кредит.</p>
              </div>
              <div className="debtsCon__iconCol">
                <div className="debtsCon__iconPlate" role="img" aria-label="Молоток судьи">
                  <Image src="/Media/Hammer.png" alt="" width={140} height={140} />
                </div>
              </div>
            </article>

            {/* 2 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">10 лет</h3>
                <p>
                  Нельзя занимать управленческую должность
                  в кредитной организации.
                </p>
              </div>
              <div className="debtsCon__iconCol">
                <div className="debtsCon__iconPlate" role="img" aria-label="Банк">
                  <Image src="/Media/Bank.png" alt="" width={140} height={140} />
                </div>
              </div>
            </article>

            {/* 3 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">5 лет</h3>
                <p>
                  Нельзя работать в управлении страховых и микрофинансовых
                  организаций, а также негосударственных пенсионных,
                  инвестиционных и паевых фондах.
                </p>
              </div>
              <div className="debtsCon__iconCol">
                <div className="debtsCon__iconPlate" role="img" aria-label="Замок">
                  <Image src="/Media/Lock.png" alt="" width={140} height={140} />
                </div>
              </div>
            </article>

            {/* 4 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">3 года</h3>
                <p>
                  Нельзя быть директором, членом совета директоров или правления
                  любого юридического лица.
                </p>
              </div>
              <div className="debtsCon__iconCol">
                <div className="debtsCon__iconPlate" role="img" aria-label="Портфель">
                  <Image src="/Media/SuitCase.png" alt="" width={140} height={140} />
                </div>
              </div>
            </article>
          </div>

          {/* CTA */}
          <div className="debtsCon__cta">
            <button
              type="button"
              className="debtsCon__btn"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-controls="debtsCon-modal"
            >
              <span className="debtsCon__btnIco" aria-hidden>📞</span>
              <span>Получить бесплатную консультацию</span>
            </button>
          </div>
        </div>
      </section>

      {/* Модалка с формой */}
      {open && (
        <div
          id="debtsCon-modal"
          className="debtsConModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="debtsConModal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="debtsConModal__card">
            <button
              className="debtsConModal__close"
              aria-label="Закрыть"
              onClick={() => setOpen(false)}
            >
              <span />
              <span />
            </button>

            <h3 id="debtsConModal-title" className="debtsConModal__title">
              Оставьте контакты — расскажем, что именно вам можно списать
            </h3>

            <div className="debtsConModal__form">
              <LeadForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}