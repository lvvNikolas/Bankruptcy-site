"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

// Показываем попап за 5 минут до истечения сессии
const WARN_BEFORE_MS = 5 * 60 * 1000;

const TAB_KEY = "session_active";

export function SessionGuard() {
  const { data: session, update, status } = useSession();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [visible, setVisible]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Проверка вкладки ──────────────────────────────────────────────────────
  // sessionStorage очищается при закрытии вкладки (не при обновлении).
  // Если сессия есть, но маркера вкладки нет → пользователь открыл новую
  // вкладку после закрытия предыдущей → выходим.
  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      if (!sessionStorage.getItem(TAB_KEY)) {
        signOut({ callbackUrl: "/login" });
      }
    }
  }, [status]);

  // ── Обратный отсчёт до истечения сессии ──────────────────────────────────
  useEffect(() => {
    if (!session?.expires) return;

    const expiresAt = new Date(session.expires).getTime();

    function tick() {
      const remaining = expiresAt - Date.now();

      if (remaining <= 0) {
        // Сессия истекла — останавливаем интервал и выходим
        if (timerRef.current) clearInterval(timerRef.current);
        signOut({ callbackUrl: "/login" });
        return;
      }

      if (remaining <= WARN_BEFORE_MS) {
        setSecondsLeft(Math.ceil(remaining / 1000));
        setVisible(true);
      } else {
        // Ещё далеко — попап не нужен
        setVisible(false);
        setSecondsLeft(null);
      }
    }

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.expires]);

  async function handleContinue() {
    // update() → PATCH /api/auth/session → JWT перевыпускается с новым exp
    await update();
    setVisible(false);
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  if (!visible || secondsLeft === null) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const countdown = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const isUrgent  = secondsLeft <= 60;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        style={{
          position:       "fixed",
          inset:          0,
          background:     "rgba(0,0,0,.45)",
          backdropFilter: "blur(2px)",
          zIndex:         1000,
        }}
      />

      {/* Попап */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-warn-title"
        aria-describedby="session-warn-desc"
        style={{
          position:  "fixed",
          top:       "50%",
          left:      "50%",
          transform: "translate(-50%, -50%)",
          zIndex:    1001,
          width:     "min(360px, calc(100vw - 2rem))",
          background: "var(--surface)",
          border:     "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding:    "2rem",
          boxShadow:  "0 24px 64px rgba(0,0,0,.28)",
        }}
      >
        {/* Иконка */}
        <div style={{
          width:          44,
          height:         44,
          borderRadius:   "50%",
          background:     isUrgent ? "#fee2e2" : "#fef3c7",
          border:         `1px solid ${isUrgent ? "#fca5a5" : "#fde68a"}`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "1.25rem",
          marginBottom:   "1.25rem",
          transition:     "background .3s, border-color .3s",
        }}>
          ⏱
        </div>

        <h2
          id="session-warn-title"
          style={{
            fontWeight:    700,
            fontSize:      "1rem",
            color:         "var(--text)",
            marginBottom:  ".375rem",
            letterSpacing: "-.02em",
          }}
        >
          Сессия истекает
        </h2>

        <p
          id="session-warn-desc"
          style={{
            fontSize:     ".875rem",
            color:        "var(--text-muted)",
            lineHeight:   1.6,
            marginBottom: "1.5rem",
          }}
        >
          До автоматического выхода осталось{" "}
          <span style={{
            fontVariantNumeric: "tabular-nums",
            fontWeight:         700,
            color:              isUrgent ? "#dc2626" : "var(--text)",
            transition:         "color .3s",
          }}>
            {countdown}
          </span>
          . Хотите продолжить работу?
        </p>

        <div style={{ display: "flex", gap: ".625rem" }}>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            style={{ flex: 1, fontWeight: 600 }}
            autoFocus
          >
            Продолжить
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleSignOut}
            style={{ flex: 1 }}
          >
            Выйти
          </button>
        </div>
      </div>
    </>
  );
}
