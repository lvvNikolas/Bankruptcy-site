"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "@styles/ReviewsSection.css";
import { REVIEWS } from "@data/reviews";

export default function ReviewsSection() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const total = useMemo(() => REVIEWS.length, []);

  // Подсветка активной точки по положению скролла
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const onScroll = () => {
      const w = el.clientWidth;
      if (!w) return;
      const i = Math.round(el.scrollLeft / w);
      const safeIndex = Math.max(0, Math.min(total - 1, i));
      setActive(safeIndex);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [total]);

  // Автолистание
  useEffect(() => {
    const el = railRef.current;
    if (!el || total <= 1) return;

    const id = setInterval(() => {
      const w = el.clientWidth;
      if (!w) return;
      const next = (active + 1) % total;
      el.scrollTo({ left: next * w, behavior: "smooth" });
    }, 6500);

    return () => clearInterval(id);
  }, [active, total]);

  const snapTo = (i: number) => {
    const el = railRef.current;
    if (!el) return;
    const safeIndex = Math.max(0, Math.min(total - 1, i));
    el.scrollTo({ left: safeIndex * el.clientWidth, behavior: "smooth" });
  };

  const handlePrev = () => snapTo(active - 1);
  const handleNext = () => snapTo(active + 1);

  const handleCtaClick = () => {
    window.dispatchEvent(new CustomEvent("open-leadform"));
    (document.getElementById("leadform") ||
      document.getElementById("quiz"))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="reviews section reviews--vh"
      aria-labelledby="reviews-title"
    >
      <div className="container">
        <div className="reviews__wrap">
          {/* Заголовок */}
          <header className="reviews__head">
            <p className="reviews__eyebrow">Отзывы клиентов</p>
            <h2 id="reviews-title" className="reviews__title">
              Клиенты <span className="reviews__accent">говорят о нас</span>
            </h2>
            <p className="reviews__subtitle">
              Реальные истории людей, которым мы помогли законно списать долги
              и выйти из долговой нагрузки.
            </p>
          </header>

          {/* Карусель */}
          <div
            className="reviews__stage"
            role="region"
            aria-roledescription="carousel"
            aria-label="Отзывы клиентов"
          >
            <button
              className="reviews__nav reviews__nav--prev"
              type="button"
              aria-label="Предыдущий отзыв"
              onClick={handlePrev}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 4 7 12l8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="reviews__rail" ref={railRef}>
              {REVIEWS.map((r) => (
                <article
                  key={r.id}
                  className="reviews__slide"
                  aria-label={`Отзыв клиента ${r.name}`}
                >
                  <div className="reviews__card">
                    <header className="reviews__cardHead">
                      <div>
                        <div className="reviews__name">{r.name}</div>
                        <div className="reviews__meta">{r.city}</div>
                      </div>

                      <div
                        className="reviews__stars"
                        aria-label={`Оценка ${r.stars} из 5`}
                      >
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg
                            key={s}
                            viewBox="0 0 24 24"
                            className={s < r.stars ? "on" : ""}
                            aria-hidden="true"
                          >
                            <path d="M12 17.27 18.18 21l-1.64-5.63L21 11.24l-5.82-.5L12 5 8.82 10.74l-5.82.5 4.46 4.13L5.82 21 12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                    </header>

                    <blockquote className="reviews__text">
                      «{r.text}»
                    </blockquote>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="reviews__nav reviews__nav--next"
              type="button"
              aria-label="Следующий отзыв"
              onClick={handleNext}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m9 4 8 8-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Точки */}
          <div
            className="reviews__dots"
            role="tablist"
            aria-label="Навигация по отзывам"
          >
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`reviews__dot ${
                  i === active ? "reviews__dot--active" : ""
                }`}
                onClick={() => snapTo(i)}
                aria-label={`Отзыв ${i + 1}`}
              />
            ))}
          </div>

          {/* CTA в едином стиле кнопок */}
          <div className="reviews__ctaRow">
            <button
              type="button"
              className="btn btn-primary reviews__cta"
              onClick={handleCtaClick}
            >
              Получить такую же помощь
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}