import { useEffect, useRef } from "react";
import styles from "./modal.module.css";

type Variant = "success" | "info" | "error";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  width?: number;               // max-width карточки, по умолчанию 560
  variant?: Variant;            // визуальный акцент: success/info/error
  showClose?: boolean;          // крестик в правом верхнем углу (по умолчанию true)
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  width = 560,
  variant = "info",
  showClose = true,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // блокируем скролл, ловим Esc, возвращаем фокус
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      lastActiveRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[variant]}`}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Акцентная плашка сверху */}
        <div className={styles.accent} />

        <div className={styles.head}>
          <div className={styles.lead}>
            <span className={`${styles.icon} ${styles[`icon_${variant}`]}`} aria-hidden />
            {title && <h3 className={styles.title}>{title}</h3>}
          </div>

          {showClose && (
            <button
              ref={closeBtnRef}
              className={styles.close}
              aria-label="Закрыть окно"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.body}>{children}</div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}