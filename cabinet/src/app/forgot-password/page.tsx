"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Ошибка");
      }
      setStatus("done");
    } catch (e: unknown) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "Ошибка");
    }
  };

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
            Сброс пароля
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: ".875rem" }}>
            Введите email — мы пришлём ссылку для восстановления
          </p>
        </div>

        {status === "done" ? (
          <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>✉️</div>
            <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: ".375rem" }}>Письмо отправлено</p>
            <p style={{ fontSize: ".875rem", color: "var(--text-muted)" }}>
              Если аккаунт с таким email существует, вы получите письмо со ссылкой для сброса пароля.
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: "1.75rem" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                {status === "loading" ? "Отправляем…" : "Отправить ссылку"}
              </button>
            </form>
          </div>
        )}

        <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: ".875rem" }}>
          <Link href="/login" style={{ color: "var(--text-muted)" }}>← Вернуться к входу</Link>
        </p>
      </div>
    </div>
  );
}
