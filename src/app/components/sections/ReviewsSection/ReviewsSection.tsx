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
      const i = Math.round(el.scrollLeft / w);
      if (i !== active) setActive(Math.max(0, Math.min(total - 1, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [active, total]);

  // Автолистание
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const id = setInterval(() => {
      const w = el.clientWidth;
      const next = (active + 1) % total;
      el.scrollTo({ left: next * w, behavior: "smooth" });
    }, 6500);
    return () => clearInterval(id);
  }, [active, total]);

  const snapTo = (i: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="reviews vh" aria-labelledby="reviews-title">
      <div className="reviews__wrap container">
        <h2 id="reviews-title" className="reviews__title">
          Клиенты <span className="reviews__accent">говорят о нас</span>
        </h2>

        <div className="reviews__stage" role="region" aria-roledescription="carousel">
          <button
            className="reviews__nav reviews__nav--prev"
            aria-label="Предыдущий отзыв"
            onClick={() => snapTo(Math.max(0, active - 1))}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <div className="reviews__rail" ref={railRef}>
            {REVIEWS.map((r) => (
              <article key={r.id} className="reviews__slide">
                <div className="reviews__card">
                  <header className="reviews__head">
                    <div className="reviews__name">{r.name}</div>
                    <div className="reviews__meta">{r.city}</div>
                    <div className="reviews__stars" aria-label={`Оценка ${r.stars} из 5`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg key={s} viewBox="0 0 24 24" className={s < r.stars ? "on" : ""} aria-hidden="true">
                          <path d="M12 17.27 18.18 21l-1.64-5.63L21 11.24l-5.82-.5L12 5l-3.18 5.74-5.82.5 4.46 4.13L5.82 21 12 17.27z" />
                        </svg>
                      ))}
                    </div>
                  </header>

                  <blockquote className="reviews__text">“{r.text}”</blockquote>
                </div>
              </article>
            ))}
          </div>

          <button
            className="reviews__nav reviews__nav--next"
            aria-label="Следующий отзыв"
            onClick={() => snapTo(Math.min(total - 1, active + 1))}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="m9 4 8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="reviews__dots" role="tablist" aria-label="Навигация по отзывам">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              className={`reviews__dot ${i === active ? "active" : ""}`}
              onClick={() => snapTo(i)}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="reviews__cta"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-leadform"));
            (document.getElementById("leadform") || document.getElementById("quiz"))?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          Получить такую же помощь
        </button>
      </div>
    </section>
  );
}