"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LeadForm from "@components/LeadForm/LeadForm";
import "@styles/DebtsCon.css";

export default function DebtsCon() {
  const [open, setOpen] = useState(false);

  // Закрытие по Esc + блокировка скролла фона
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <section
        id="debts-con"
        className="debtsCon"
        aria-labelledby="debtsCon-title"
      >
        <div className="container">
          {/* Заголовок блока */}
          <header className="debtsCon__head debtsCon__head--center">
            <h2 id="debtsCon-title" className="debtsCon__title">
              Последствия после банкротства
            </h2>
            <p className="debtsCon__subtitle">
              Кратко о реальных ограничениях, которые действуют после списания долгов
            </p>
          </header>

          {/* Сетка карточек */}
          <div className="debtsCon__grid">
            {/* 1 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">5 лет</h3>
                <p>Нельзя повторно обращаться в суд с заявлением о банкротстве.</p>
                <p>При оформлении новых кредитов нужно сообщать о факте банкротства.</p>
              </div>

              <div className="debtsCon__iconCol">
                <div
                  className="debtsCon__iconPlate"
                  role="img"
                  aria-label="Судебный молоток"
                >
                  <Image
                    src="/media/Hammer.png"
                    alt=""
                    width={140}
                    height={140}
                  />
                </div>
              </div>
            </article>

            {/* 2 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">10 лет</h3>
                <p>
                  Нельзя занимать должности в органах управления кредитных
                  организаций (банков).
                </p>
              </div>

              <div className="debtsCon__iconCol">
                <div
                  className="debtsCon__iconPlate"
                  role="img"
                  aria-label="Здание банка"
                >
                  <Image
                    src="/media/Bank.png"
                    alt=""
                    width={140}
                    height={140}
                  />
                </div>
              </div>
            </article>

            {/* 3 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">5 лет</h3>
                <p>
                  Нельзя работать в органах управления страховых, микрофинансовых,
                  негосударственных пенсионных и инвестиционных фондов.
                </p>
              </div>

              <div className="debtsCon__iconCol">
                <div
                  className="debtsCon__iconPlate"
                  role="img"
                  aria-label="Замок"
                >
                  <Image
                    src="/media/Lock.png"
                    alt=""
                    width={140}
                    height={140}
                  />
                </div>
              </div>
            </article>

            {/* 4 */}
            <article className="debtsCon__card">
              <div className="debtsCon__textCol">
                <h3 className="debtsCon__years">3 года</h3>
                <p>
                  Нельзя быть директором, членом совета директоров или правления
                  любых юридических лиц.
                </p>
              </div>

              <div className="debtsCon__iconCol">
                <div
                  className="debtsCon__iconPlate"
                  role="img"
                  aria-label="Деловой портфель"
                >
                  <Image
                    src="/media/SuitCase.png"
                    alt=""
                    width={140}
                    height={140}
                  />
                </div>
              </div>
            </article>
          </div>

          {/* CTA */}
          <div className="debtsCon__cta">
            <button
              type="button"
              className="btn btn-primary debtsCon__btn"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-controls="debtsCon-modal"
            >
              <span className="debtsCon__btnIco" aria-hidden>
                📞
              </span>
              <span>Получить бесплатную консультацию</span>
            </button>
          </div>
        </div>
      </section>

      {/* Модальное окно с формой */}
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
              type="button"
              aria-label="Закрыть"
              onClick={() => setOpen(false)}
            >
              <span />
              <span />
            </button>

            <h3
              id="debtsConModal-title"
              className="debtsConModal__title"
            >
              Оставьте контакты — подскажем, какие долги можно списать именно вам
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