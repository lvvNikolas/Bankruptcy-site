"use client";

import Link from "next/link";

/**
 * SegmentError — общий UI для error.tsx сегментов.
 * Используется в каждом route-сегменте для единообразной обработки ошибок.
 *
 * Принимает те же пропсы, что и error.tsx Next.js:
 *   - error  — объект ошибки (в dev видно сообщение, в prod нет)
 *   - reset  — функция повтора рендера без перезагрузки страницы
 *   - label  — человекочитаемое название раздела (напр. «Блог»)
 */
type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  /** Название раздела для сообщения пользователю */
  label?: string;
};

export default function SegmentError({ error, reset, label = "страница" }: Props) {
  // digest — хеш для поиска в логах сервера (безопасно показывать в UI)
  const digest = error.digest;

  return (
    <div
      role="alert"
      style={{
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
        Не удалось загрузить {label}
      </h2>

      <p style={{ color: "var(--text-muted, #64748b)", maxWidth: 380 }}>
        Произошла техническая ошибка. Попробуйте обновить страницу или вернитесь на главную.
      </p>

      {/* digest показываем только в dev или для поддержки, в prod он не раскрывает детали */}
      {digest && (
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted, #94a3b8)" }}>
          Код ошибки: {digest}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        {/* Повторить рендер сегмента без перезагрузки всей страницы */}
        <button onClick={reset} className="btn btn-primary" style={{ minWidth: 160 }}>
          Попробовать снова
        </button>

        <Link href="/" className="btn btn-secondary" style={{ minWidth: 120 }}>
          На главную
        </Link>
      </div>
    </div>
  );
}
