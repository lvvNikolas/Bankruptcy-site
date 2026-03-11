"use client";

import { useState } from "react";
import "@styles/MobileCTA.css";

export default function MobileCTA() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mcta" role="complementary" aria-label="Быстрая связь">
      <button
        className="mcta__close"
        onClick={() => setDismissed(true)}
        aria-label="Закрыть"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <a href="tel:+79162979645" className="mcta__phone" aria-label="Позвонить">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/>
        </svg>
        +7 (916) 297-96-45
      </a>

      <a href="#zayavka" className="mcta__btn">
        Получить консультацию
      </a>
    </div>
  );
}