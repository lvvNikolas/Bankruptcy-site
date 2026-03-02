"use client";

import { useEffect, useState } from "react";
import "@styles/ScrollTopButton.css";

type CSSWithVars = React.CSSProperties & Record<string, string | number>;

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
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
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="scrolltop__icon"
        >
          <path
            d="M5 15l7-7 7 7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    </button>
  );
}