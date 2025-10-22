"use client";

import { useEffect, useMemo, useState } from "react";
import "@styles/ScrollTopButton.css";

/** Тип, позволяющий передавать CSS custom properties без any */
type CSSVars = React.CSSProperties & Record<string, string | number>;

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0); // 0..100

  // высота документа (без пересчёта на каждый скролл)
  const maxScrollable = useMemo(
    () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    []
  );

  useEffect(() => {
    const calc = () => {
      const scrolled = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        max > 0 ? Math.min(100, Math.max(0, (scrolled / max) * 100)) : 0;

      setPct(Math.round(progress));
      setVisible(scrolled > 400);
    };

    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, []);

  const style: CSSVars = { "--pct": `${pct}%` };

  return (
    <button
      type="button"
      aria-label="Наверх"
      title="Наверх"
      className={`scrolltop ${visible ? "scrolltop--show" : ""}`}
      style={style}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span className="scrolltop__core">
        {/* Стрелка вверх */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="scrolltop__icon"
        >
          <path d="M12 5l7 7-1.41 1.41L13 9.83V19h-2V9.83l-4.59 4.58L5 12l7-7z" />
        </svg>

        {/* Проценты (визуально), скринридерам не читаем */}
        <span className="scrolltop__pct" aria-hidden="true">
          {pct}%
        </span>
      </span>
    </button>
  );
}