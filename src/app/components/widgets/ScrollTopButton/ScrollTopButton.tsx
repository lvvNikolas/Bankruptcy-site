"use client";

import { useEffect, useState } from "react";
import "@styles/ScrollTopButton.css";

/** Позволяет прокинуть CSS-переменные без any */
type CSSWithVars = React.CSSProperties & Record<string, string | number>;

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0); // 0..100

  useEffect(() => {
    // защищаемся на всякий случай — этот эффект не выполнится на сервере
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const calc = () => {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const scrolled = window.scrollY;
      const p = max > 0 ? Math.min(100, Math.max(0, (scrolled / max) * 100)) : 0;

      setPct(Math.round(p));
      setShow(scrolled > 400);
    };

    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, []);

  const styleWithVar: CSSWithVars = { "--pct": `${pct}%` };

  return (
    <button
      aria-label="Наверх"
      className={`scrolltop ${show ? "scrolltop--show" : ""}`}
      style={styleWithVar}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
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
        {/* Проценты */}
        <span className="scrolltop__pct" aria-hidden="true">
          {pct}%
        </span>
      </span>
    </button>
  );
}