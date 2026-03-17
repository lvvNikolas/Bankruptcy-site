"use client";

import { useEffect, useRef, useState } from "react";
import "@styles/LiveStats.css";

type Slide =
  | { type: "counter"; count: number }
  | { type: "case"; city: string; amount: string; name: string; ago: string };

const SLIDES: Slide[] = [
  { type: "counter", count: 43 },
  { type: "case", city: "Москва",          name: "Александр К.",  amount: "1 200 000 ₽", ago: "2 часа назад"  },
  { type: "case", city: "Воронеж",          name: "Светлана М.",   amount: "680 000 ₽",   ago: "5 часов назад" },
  { type: "counter", count: 43 },
  { type: "case", city: "Краснодар",       name: "Дмитрий Р.",    amount: "2 100 000 ₽", ago: "вчера"         },
  { type: "case", city: "Ставрополь",      name: "Наталья В.",    amount: "950 000 ₽",   ago: "вчера"         },
  { type: "counter", count: 43 },
  { type: "case", city: "Санкт-Петербург", name: "Михаил С.",     amount: "1 750 000 ₽", ago: "2 дня назад"   },
];

const INTERVAL = 5000;
const APPEAR_DELAY = 3000;

export default function LiveStats() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef<number | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), APPEAR_DELAY);
    return () => clearTimeout(t);
  }, []);

  // Progress bar + slide rotation
  useEffect(() => {
    if (!visible || dismissed) return;

    const tick = () => {
      const elapsed = Date.now() - startedAt.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed < INTERVAL) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    const next = () => {
      startedAt.current = Date.now();
      setProgress(0);
      setIndex((i) => (i + 1) % SLIDES.length);
      setAnimKey((k) => k + 1);
      raf.current = requestAnimationFrame(tick);
    };

    startedAt.current = Date.now();
    raf.current = requestAnimationFrame(tick);
    timer.current = setInterval(next, INTERVAL);

    return () => {
      if (timer.current) clearInterval(timer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [visible, dismissed]);

  if (!visible || dismissed) return null;

  const slide = SLIDES[index];

  return (
    <div className="ls" role="status" aria-live="polite" aria-atomic="true">

      {/* Progress bar */}
      <div className="ls__bar" aria-hidden="true">
        <div className="ls__bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Close */}
      <button className="ls__x" onClick={() => setDismissed(true)} aria-label="Закрыть">
        <svg width="9" height="9" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="ls__slide" key={animKey}>
        {slide.type === "counter" ? (

          /* === COUNTER SLIDE === */
          <div className="ls__inner">
            <div className="ls__live-badge">
              <span className="ls__live-dot" aria-hidden="true" />
              LIVE
            </div>
            <div className="ls__counter-row">
              <span className="ls__big-num">{slide.count}</span>
              <div className="ls__counter-labels">
                <span className="ls__counter-main">дела в работе</span>
                <span className="ls__counter-sub">прямо сейчас · по всей России</span>
              </div>
            </div>
          </div>

        ) : (

          /* === CASE SLIDE === */
          <div className="ls__inner">
            <div className="ls__done-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              ЗАКРЫТО
            </div>
            <div className="ls__case-row">
              <div className="ls__case-who">
                <span className="ls__case-name">{slide.name}</span>
                <span className="ls__case-city">{slide.city}</span>
              </div>
              <div className="ls__case-amount">{slide.amount}</div>
            </div>
            <div className="ls__case-meta">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm.5 5v5.25l4.5 2.67-.75 1.27L11 13.5V7h1.5Z"/>
              </svg>
              {slide.ago} · долг списан полностью
            </div>
          </div>

        )}
      </div>

      {/* Dots */}
      <div className="ls__dots" aria-hidden="true">
        {SLIDES.map((_, i) => (
          <span key={i} className={`ls__dot ${i === index ? "ls__dot--active" : ""}`} />
        ))}
      </div>

    </div>
  );
}
