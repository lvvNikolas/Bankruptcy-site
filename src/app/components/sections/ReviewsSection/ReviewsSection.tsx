"use client";

import "@styles/ReviewsSection.css";
import { REVIEWS } from "@data/reviews";

const STATS = [
  { num: "500+",  label: "клиентов" },
  { num: "4.9",   label: "средняя оценка" },
  { num: "98%",   label: "положительных" },
  { num: "7 лет", label: "на рынке" },
];

export default function ReviewsSection() {
  const handleCtaClick = () => {
    window.dispatchEvent(new CustomEvent("open-leadform"));
    (document.getElementById("leadform") ||
      document.getElementById("quiz"))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="reviews" aria-labelledby="reviews-title" id="reviews">
      <div className="reviews__bg" aria-hidden="true" />

      <div className="container">

        {/* Шапка */}
        <header className="reviews__head">
          <span className="reviews__eyebrow">Отзывы клиентов</span>
          <h2 id="reviews-title" className="reviews__title">
            Клиенты <em className="reviews__accent">говорят о нас</em>
          </h2>
          <p className="reviews__subtitle">
            Реальные истории людей, которым мы помогли законно списать долги
            и выйти из долговой нагрузки.
          </p>
        </header>

        {/* Полоса статистики */}
        <div className="reviews__stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="reviews__statItem">
              <span className="reviews__statNum">{s.num}</span>
              <span className="reviews__statLabel">{s.label}</span>
              {i < STATS.length - 1 && (
                <span className="reviews__statSep" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* Сетка отзывов */}
        <div className="reviews__grid" role="list">
          {REVIEWS.map((r) => {
            const initial = String(r.name || "?").trim().charAt(0).toUpperCase();
            return (
              <article key={r.id} className="reviews__card" role="listitem">

                {/* Декоративная кавычка */}
                <span className="reviews__quoteIco" aria-hidden="true">"</span>

                {/* Бейдж суммы */}
                {r.debtAmount && (
                  <div className="reviews__debtBadge">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.5h-1.5V6h-1.5v1H6v1.5h1.5v1H6V11h1.5v1h1.5v1h1.5v-1H12v-1.5h-2v-1H12V8h-1.25Z"/>
                    </svg>
                    Списано: <strong>{r.debtAmount}</strong>
                    {r.duration && (
                      <span className="reviews__duration">за {r.duration}</span>
                    )}
                  </div>
                )}

                {/* Текст */}
                <p className="reviews__text">«{r.text}»</p>

                {/* Автор + звёзды */}
                <div className="reviews__bottom">
                  <div className="reviews__author">
                    <div className="reviews__avatar" aria-hidden="true">{initial}</div>
                    <div className="reviews__who">
                      <div className="reviews__name">{r.name}</div>
                      <div className="reviews__city">{r.city}</div>
                    </div>
                  </div>

                  <div className="reviews__stars" aria-label={`Оценка ${r.stars} из 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`reviews__star ${i < r.stars ? "is-on" : ""}`} />
                    ))}
                  </div>
                </div>

                {/* Подвал карточки */}
                <div className="reviews__cardFoot">
                  <span className="reviews__verified">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                    Проверенный отзыв
                  </span>
                  <button type="button" className="reviews__miniCta" onClick={handleCtaClick}>
                    Хочу так же →
                  </button>
                </div>

              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="reviews__actions">
          <button type="button" className="reviews__btnPrimary" onClick={handleCtaClick}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.5 2.5.7 3.9.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.4.2 2.7.7 3.9.1.4 0 .8-.2 1.1L6.6 10.8Z"/>
            </svg>
            Получить консультацию
          </button>

          <a className="reviews__btnOutline" href="/cases">
            Смотреть все кейсы
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
