"use client";

import type { MouseEvent } from "react";
import "@styles/CtaSection.css";

/** Блок из трёх преимуществ + большая CTA-кнопка, ведущая к квизу */
export default function CtaSection({
  targetId = "quiz",
}: {
  /** id блока, к которому скроллим по клику */
  targetId?: string;
}) {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container">
        {/* Заголовок */}
        <header className="cta__head">
          <h2 id="cta-title" className="cta__title">
            Списать долги{" "}
            <span className="cta__accent">в 7 раз дешевле</span> —
            чем продолжать их выплачивать
          </h2>
          <p className="cta__lead">
            Реальное банкротство без риска — с юристами, у которых 100 % выигранных
            дел и официальная судебная практика.
          </p>
        </header>

        {/* Три карточки преимуществ */}
        <div className="cta__grid">
          {[
            {
              num: "01",
              title: "Долг обязательно будет списан",
              text: "За 7 лет судебной практики — ни одного проигранного дела.",
              icon: (
                <path
                  d="M2 20h20v2H2v-2Zm9.7-12.3 1.6-1.6 2.6 2.6-1.6 1.6-2.6-2.6Zm-6 6 5.3-5.3 2.6 2.6L8.3 16.3l-2.6-2.6Zm-1.4 4.6 4-1.1-2.9-2.9-1.1 4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
            {
              num: "02",
              title: "Перестаёте платить кредиторам",
              text: "После подачи заявления суд вводит мораторий — платежи прекращаются.",
              icon: (
                <>
                  <path
                    d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 3h18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16.5" cy="14" r="1.25" fill="currentColor" />
                </>
              ),
            },
            {
              num: "03",
              title: "Сохраняете имущество",
              text: "Дом, автомобиль, зарплата и детские пособия — под защитой закона.",
              icon: (
                <path
                  d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ),
            },
          ].map(({ num, title, text, icon }) => (
            <article className="cta__card" key={num}>
              <header className="cta__cardHead">
                <span className="cta__num">{num}</span>
                <span className="cta__ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="36" height="36">
                    {icon}
                  </svg>
                </span>
              </header>
              <h3 className="cta__cardTitle">{title}</h3>
              <p className="cta__cardText">{text}</p>
            </article>
          ))}
        </div>

        {/* Большая золотая кнопка */}
        <div className="cta__btnRow">
          <button
            type="button"
            className="btn btn-primary cta__btn"
            onClick={onClick}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M3 5h18v4H3V5Zm0 6h10v8H3v-8Zm12 0h6v8h-6v-8Z"
                fill="currentColor"
              />
            </svg>
            Узнать стоимость списания долгов
          </button>
        </div>
      </div>
    </section>
  );
}