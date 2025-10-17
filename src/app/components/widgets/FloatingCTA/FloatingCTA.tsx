"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "@components/LeadForm/LeadForm";
import "@styles/FloatingCTA.css";

/**
 * FloatingCTA — плавающая кнопка «Заявка» с модальной формой.
 * Показывается:
 *   1) при скролле вниз на SCROLL_THRESHOLD пикселей
 *   2) или через INACTIVITY_TIMEOUT мс бездействия
 */
const SCROLL_THRESHOLD = 200;    // px
const INACTIVITY_TIMEOUT = 5000; // ms

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const scrolled = useRef(false);
  const timerRef = useRef<number | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Показ по скроллу или таймауту
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        scrolled.current = true;
        setVisible(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!scrolled.current) {
      timerRef.current = window.setTimeout(() => {
        if (!scrolled.current) setVisible(true);
      }, INACTIVITY_TIMEOUT);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Открытие по пользовательскому событию (например, из квиза)
  useEffect(() => {
    const openByEvent = () => setOpened(true);
    window.addEventListener("cta_open_request", openByEvent);
    return () => window.removeEventListener("cta_open_request", openByEvent);
  }, []);

  // Escape для закрытия модалки
  useEffect(() => {
    if (!opened) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpened(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [opened]);

  const handleOpen = () => setOpened(true);
  const handleClose = () => {
    setOpened(false);
    btnRef.current?.focus(); // возврат фокуса
  };

  return (
    <>
      {/* Плавающая кнопка */}
      {visible && (
        <div className="floating-cta-wrap">
          <button
            ref={btnRef}
            className="floating-cta-fab"
            onClick={handleOpen}
            aria-haspopup="dialog"
            aria-controls="lead-modal"
          >
            Заявка
          </button>
        </div>
      )}

      {/* Модалка */}
      {opened && (
        <div
          id="lead-modal"
          role="dialog"
          aria-modal="true"
          className="floating-cta-backdrop"
          onClick={handleClose} /* клик по фону закрывает */
        >
          <div
            className="floating-cta-modal floating-cta-slideUp"
            onClick={(e) => e.stopPropagation()} /* клики внутри не закрывают */
          >
            <div className="floating-cta-modalHead">
              <h2 className="floating-cta-title">Быстрая заявка</h2>
              <button
                className="floating-cta-modalClose"
                onClick={handleClose}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
            <p className="floating-cta-lead">
              Оставьте контакты — мы перезвоним и подскажем, подходит ли вам процедура.
            </p>
            <LeadForm />
          </div>
        </div>
      )}
    </>
  );
}