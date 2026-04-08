"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "@/app/components/LeadForm/LeadForm";
import "@styles/ExitPopup.css";
import { EXIT_POPUP_DELAY_MS } from "@/config";

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

    // Принудительный показ если пользователь не покинул страницу мышью
    const timer = setTimeout(show, EXIT_POPUP_DELAY_MS);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => setVisible(false);

  // Escape + focus trap
  useEffect(() => {
    if (!visible) return;

    const box = document.querySelector<HTMLElement>(".epop__box");
    if (!box) return;

    const focusable = Array.from(
      box.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    focusable[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
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