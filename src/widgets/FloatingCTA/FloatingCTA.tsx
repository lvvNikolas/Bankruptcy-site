import { useEffect, useRef, useState } from "react";
import styles from "./FloatingCTA.module.css";
import LeadForm from "@features/LeadForm/LeadForm";

const SCROLL_THRESHOLD = 200;      // px
const INACTIVITY_TIMEOUT = 5000;   // ms

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const scrolled = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Показываем кнопку: при скролле или через 5 сек
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

  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  return (
    <>
      {visible && (
        <div className={styles.wrap}>
          <button
            className={styles.fab}
            onClick={handleOpen}
            aria-haspopup="dialog"
            aria-controls="lead-modal"
          >
            Заявка
          </button>
        </div>
      )}

      {opened && (
        <div
          id="lead-modal"
          role="dialog"
          aria-modal="true"
          className={styles.backdrop}
          onClick={handleClose}
        >
          <div
            className={`${styles.modal} ${styles.slideUp}`}
            onClick={(e) => e.stopPropagation()}
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
              Оставьте контакты — мы перезвоним и подскажем, подходит ли вам
              процедура.
            </p>
            <LeadForm />
          </div>
        </div>
      )}
    </>
  );
}