"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // В продакшне console удаляется компилятором; в разработке полезно видеть
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Что-то пошло не так</h1>
      <p style={{ color: "var(--text-muted, #64748b)", maxWidth: 400 }}>
        Произошла ошибка при загрузке страницы. Попробуйте обновить или вернитесь на главную.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          className="btn btn-primary"
          style={{ minWidth: 140 }}
        >
          Попробовать снова
        </button>
        <Link href="/" className="btn btn-secondary" style={{ minWidth: 140 }}>
          На главную
        </Link>
      </div>
    </div>
  );
}
