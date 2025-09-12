import { useEffect, useRef, useState } from "react";
import styles from "./FloatingCTA.module.css";
import LeadForm from "@features/LeadForm/LeadForm";

/** 
 * FloatingCTA — плавающая кнопка «Заявка» с модальной формой.
 * Показывается:
 *   1) при скролле вниз на SCROLL_THRESHOLD пикселей
 *   2) или через INACTIVITY_TIMEOUT мс, если пользователь не скроллит
 */
const SCROLL_THRESHOLD = 200;      // px
const INACTIVITY_TIMEOUT = 5000;   // ms

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false); // видна ли кнопка
  const [opened, setOpened] = useState(false);   // открыта ли модалка
  const scrolled = useRef(false);                // флаг — был ли скролл
  const timerRef = useRef<number | null>(null);  // таймер ожидания
  const btnRef = useRef<HTMLButtonElement | null>(null); // кнопка для возврата фокуса

  /** Показываем кнопку по скроллу или таймауту */
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

  /** Подписываемся на кастомное событие: открытие по запросу (например, из Quiz) */
  useEffect(() => {
    const openByEvent = () => setOpened(true);
    window.addEventListener("cta_open_request", openByEvent);
    return () => window.removeEventListener("cta_open_request", openByEvent);
  }, []);

  /** Обработка Escape для закрытия модалки */
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
    // Возвращаем фокус на кнопку для доступности
    btnRef.current?.focus();
  };

  return (
    <>
      {/* Плавающая кнопка */}
      {visible && (
        <div className={styles.wrap}>
          <button
            ref={btnRef}
            className={styles.fab}
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
          className={styles.backdrop}
          onClick={handleClose} /* клик по фону закрывает */
        >
          <div
            className={`${styles.modal} ${styles.slideUp}`}
            onClick={(e) => e.stopPropagation()} /* предотвращаем закрытие при клике внутри */
          >
            <div className={styles.modalHead}>
              <h2 className={styles.title}>Быстрая заявка</h2>
              <button
                className={styles.modalClose}
                onClick={handleClose}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
            <p className={styles.lead}>
              Оставьте контакты — мы перезвоним и подскажем,
              подходит ли вам процедура.
            </p>
            <LeadForm />
          </div>
        </div>
      )}
    </>
  );
}