"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") ?? "";

  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [status,    setStatus]    = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg,    setErrMsg]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      setStatus("error");
      setErrMsg("Пароли не совпадают");
      return;
    }
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setStatus("done");
      setTimeout(() => router.push("/login"), 2000);
    } catch (e: unknown) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "Ошибка");
    }
  };

  if (!token) {
    return (
      <p style={{ color: "var(--danger)", fontSize: ".875rem" }}>
        Неверная ссылка. <Link href="/forgot-password">Запросить новую</Link>
      </p>
    );
  }

  return status === "done" ? (
    <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>✓</div>
      <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: ".375rem" }}>Пароль изменён</p>
      <p style={{ fontSize: ".875rem", color: "var(--text-muted)" }}>Перенаправляем на страницу входа…</p>
    </div>
  ) : (
    <div className="card" style={{ padding: "1.75rem" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="field">
          <label className="label" htmlFor="password">Новый пароль</label>
          <input
            id="password"
            className="input"
            type="password"
            placeholder="Минимум 6 символов"
            minLength={6}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="password2">Повторите пароль</label>
          <input
            id="password2"
            className="input"
            type="password"
            placeholder="Повторите пароль"
            required
            value={password2}
            onChange={e => setPassword2(e.target.value)}
          />
        </div>

        {status === "error" && (
          <div style={{
            padding: ".625rem .875rem",
            background: "var(--danger-bg)",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-sm)",
            color: "var(--danger)",
            fontSize: ".8125rem",
          }} role="alert">{errMsg}</div>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === "loading"}
          style={{ width: "100%", fontWeight: 600 }}
        >
          {status === "loading" ? "Сохраняем…" : "Сохранить пароль"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 6,
            background: "#2563eb", fontSize: ".8125rem", fontWeight: 700, color: "#fff",
            marginBottom: "1.25rem",
          }}>БС</div>
          <h1 style={{ fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-.02em", color: "var(--text)", marginBottom: ".25rem" }}>
            Новый пароль
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: ".875rem" }}>
            Придумайте новый пароль для входа в кабинет
          </p>
        </div>

        <Suspense fallback={<div className="card" style={{ padding: "1.5rem" }}>Загрузка…</div>}>
          <ResetForm />
        </Suspense>

        <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: ".875rem" }}>
          <Link href="/login" style={{ color: "var(--text-muted)" }}>← Вернуться к входу</Link>
        </p>
      </div>
    </div>
  );
}
