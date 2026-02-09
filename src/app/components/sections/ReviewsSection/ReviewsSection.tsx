"use client";

import "@styles/ReviewsSection.css";
import { REVIEWS } from "@data/reviews";

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
      <div className="container">
        <header className="reviews__head">
          <p className="reviews__eyebrow">Отзывы клиентов</p>
          <h2 id="reviews-title" className="reviews__title">
            Клиенты <span className="reviews__accent">говорят о нас</span>
          </h2>
          <p className="reviews__subtitle">
            Реальные истории людей, которым мы помогли законно списать долги и выйти из долговой нагрузки.
          </p>

          <div className="reviews__actions">
            <button type="button" className="btn btn-primary" onClick={handleCtaClick}>
              Получить консультацию
            </button>

            <a className="btn btn-outline" href="/cases">
              Смотреть кейсы
            </a>
          </div>
        </header>

        <div className="reviews__grid" role="list">
          {REVIEWS.map((r) => (
            <article key={r.id} className="reviews__card" role="listitem">
              <div className="reviews__top">
                <div className="reviews__avatar" aria-hidden="true">
                  {String(r.name || "?").trim().charAt(0).toUpperCase()}
                </div>

                <div className="reviews__who">
                  <div className="reviews__name">{r.name}</div>
                  <div className="reviews__city">{r.city}</div>
                </div>

                <div className="reviews__stars" aria-label={`Оценка ${r.stars} из 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`reviews__star ${i < r.stars ? "is-on" : ""}`} />
                  ))}
                </div>
              </div>

              <p className="reviews__text">«{r.text}»</p>

              <div className="reviews__bottom">
                <span className="reviews__badge">Проверенный отзыв</span>

                <button type="button" className="reviews__miniCta" onClick={handleCtaClick}>
                  Хочу так же
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="reviews__foot">
          <span className="reviews__hint">Показаны все отзывы</span>
        </div>
      </div>
    </section>
  );
}