"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "@/app/components/LeadForm/LeadForm";
import "@styles/ExitPopup.css";

export default function ExitPopup() {
  const [visible, setVisible] = useState(false);
  const shown = useRef(false);

  const show = () => {
    if (shown.current) return;
    try {
      if (sessionStorage.getItem("epop_shown")) return;
      sessionStorage.setItem("epop_shown", "1");
    } catch {}
    shown.current = true;
    setVisible(true);
  };

  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) show();
    };

    const timer = setTimeout(show, 40000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="epop" role="dialog" aria-modal="true" aria-label="Бесплатная консультация">
      <div className="epop__backdrop" onClick={close} aria-hidden="true" />
      <div className="epop__box">
        <button className="epop__close" onClick={close} aria-label="Закрыть">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="epop__badge">Бесплатно</div>
        <h2 className="epop__title">Консультация юриста — бесплатно</h2>
        <p className="epop__sub">Ответим за 15 минут. Без обязательств.</p>

        <LeadForm
          context="exit_popup"
          formId="exit_popup_form"
          onSuccess={close}
        />
      </div>
    </div>
  );
}