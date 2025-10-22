"use client";

import type { MouseEvent } from "react";
import "@styles/CtaSection.css";

/** Три карточки по центру + большая CTA-кнопка */
export default function CtaSection({
  targetId = "quiz",
}: {
  /** id блока, к которому скроллим */
  targetId?: string;
}) {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="cta3" aria-labelledby="cta3-title">
      <div className="container">

        {/* Заголовок */}
        <h2 id="cta3-title" className="cta3__title">
          Списать долги <span className="cta3__accent">в 7 раз дешевле</span> чем платить их
        </h2>

        {/* Три карточки */}
        <div className="cta3__grid">
          {/* 1 */}
          <article className="cta3__card">
            <header className="cta3__cardHead">
              <span className="cta3__num">01</span>
              <span className="cta3__ico" aria-hidden="true">
                {/* молоток/правосудие */}
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path
                    d="M2 20h20v2H2v-2Zm9.7-12.3 1.6-1.6 2.6 2.6-1.6 1.6-2.6-2.6Zm-6 6 5.3-5.3 2.6 2.6L8.3 16.3l-2.6-2.6Zm-1.4 4.6 4-1.1-2.9-2.9-1.1 4Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </header>

            <h3 className="cta3__cardTitle">
              Долг обязательно<br/> будет списан
            </h3>
            <p className="cta3__cardText">
              За 7 лет судебной практики ни одного проигранного дела в арбитражном суде.
            </p>
          </article>

          {/* 2 */}
          <article className="cta3__card">
            <header className="cta3__cardHead">
              <span className="cta3__num">02</span>
              <span className="cta3__ico" aria-hidden="true">
                {/* карта/кошелёк */}
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path
                    d="M3 6h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 3h18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16.5" cy="14" r="1.25" fill="currentColor" />
                </svg>
              </span>
            </header>

            <h3 className="cta3__cardTitle">Перестаёте платить кредиторам</h3>
            <p className="cta3__cardText">
              Долговая нагрузка снижается, вы освобождаетесь от платежей по кредитам.
            </p>
          </article>

          {/* 3 */}
          <article className="cta3__card">
            <header className="cta3__cardHead">
              <span className="cta3__num">03</span>
              <span className="cta3__ico" aria-hidden="true">
                {/* дом */}
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path
                    d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </header>

            <h3 className="cta3__cardTitle">Сохраняете своё имущество</h3>
            <p className="cta3__cardText">
              Обеспечиваем гарантию по защите вашего имущества — прописанную в договоре.
            </p>
          </article>
        </div>

        {/* Кнопка */}
        <div className="cta3__btnRow">
          <button type="button" className="cta3__btn" onClick={onClick}>
            <span className="cta3__btnIco" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M3 5h18v4H3V5Zm0 6h10v8H3v-8Zm12 0h6v8h-6v-8Z" fill="currentColor"/>
              </svg>
            </span>
            УЗНАТЬ СТОИМОСТЬ СПИСАНИЯ ДОЛГОВ
          </button>
        </div>
      </div>
    </section>
  );
}