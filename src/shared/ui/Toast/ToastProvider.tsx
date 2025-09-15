import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from "react";
import styles from "./toast.module.css";

type Kind = "success" | "error" | "info";
type Item = { id: number; kind: Kind; message: string; timeout: number };

type Ctx = {
  success: (msg: string, timeout?: number) => void;
  error: (msg: string, timeout?: number) => void;
  info: (msg: string, timeout?: number) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Item[]>([]);

  const push = useCallback((message: string, kind: Kind, timeout = 3500) => {
    const id = Date.now() + Math.random();
    setList((prev) => [...prev, { id, kind, message, timeout }]);
    window.setTimeout(() => {
      setList((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  }, []);

  const api = useMemo<Ctx>(() => ({
    success: (m, t) => push(m, "success", t),
    error:   (m, t) => push(m, "error", t),
    info:    (m, t) => push(m, "info", t),
  }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className={styles.container} aria-live="polite" aria-atomic="true">
        {list.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[t.kind]} ${styles.enter}`}>
            <div className={styles.icon} />
            <div className={styles.msg}>{t.message}</div>
            <button
              className={styles.close}
              aria-label="Закрыть"
              onClick={() => setList(prev => prev.filter(x => x.id !== t.id))}
            >✕</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};