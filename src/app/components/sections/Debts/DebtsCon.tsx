"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LeadForm from "@/app/components/LeadForm/LeadForm";
import "@styles/DebtsCon.css";

const CARDS = [
  {
    years: "5 лет",
    items: [
      "Нельзя повторно обращаться в суд с заявлением о банкротстве.",
      "При оформлении новых кредитов нужно сообщать о факте банкротства.",
    ],
    img: { src: "/media/Hammer.png", label: "Судебный молоток" },
  },
  {
    years: "10 лет",
    items: [
      "Нельзя занимать должности в органах управления кредитных организаций (банков).",
    ],
    img: { src: "/media/Bank.png", label: "Здание банка" },
  },
  {
    years: "5 лет",
    items: [
      "Нельзя работать в органах управления страховых, микрофинансовых, негосударственных пенсионных и инвестиционных фондов.",
    ],
    img: { src: "/media/Lock.png", label: "Замок" },
  },
  {
    years: "3 года",
    items: [
      "Нельзя быть директором, членом совета директоров или правления любых юридических лиц.",
    ],
    img: { src: "/media/SuitCase.png", label: "Деловой портфель" },
  },
];

export default function DebtsCon() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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
          <header className="debtsCon__head">
            <span className="debtsCon__eyebrow">После процедуры банкротства</span>
            <h2 id="debtsCon-title" className="debtsCon__title">
              Последствия после банкротства
            </h2>
            <p className="debtsCon__subtitle">
              Кратко о реальных ограничениях, которые действуют после списания долгов
            </p>
          </header>

          <div className="debtsCon__grid">
            {CARDS.map(({ years, items, img }) => (
              <article key={years + img.src} className="debtsCon__card">
                <div className="debtsCon__textCol">
                  <div className="debtsCon__yearsWrap">
                    <span className="debtsCon__yearsBg" aria-hidden="true">{years}</span>
                    <h3 className="debtsCon__years">{years}</h3>
                  </div>
                  {items.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>

                <div className="debtsCon__iconCol">
                  <div
                    className="debtsCon__iconPlate"
                    role="img"
                    aria-label={img.label}
                  >
                    <Image
                      src={img.src}
                      alt=""
                      width={140}
                      height={140}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="debtsCon__cta">
            <button
              type="button"
              className="debtsCon__btn"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-controls="debtsCon-modal"
            >
              <svg
                className="debtsCon__btnIco"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.5 2.5.7 3.9.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.4.2 2.7.7 3.9.1.4 0 .8-.2 1.1L6.6 10.8Z" />
              </svg>
              Получить бесплатную консультацию
            </button>
          </div>
        </div>
      </section>

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

            <div className="debtsConModal__head">
              <span className="debtsConModal__badge">Бесплатно</span>
              <h3 id="debtsConModal-title" className="debtsConModal__title">
                Подскажем, какие долги можно списать именно вам
              </h3>
              <p className="debtsConModal__sub">
                Оставьте контакты — свяжемся в течение 10 минут
              </p>
            </div>

            <div className="debtsConModal__form">
              <LeadForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}