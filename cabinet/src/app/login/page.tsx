"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Неверный email или пароль"); return; }
    router.refresh();
    router.push("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f9fafb" }}>

      {/* Left panel — dark sidebar */}
      <div
        className="login-sidebar"
        style={{
          display: "none",
          flex: "0 0 400px",
          background: "#111827",
          padding: "3rem",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Logo + brand */}
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 6,
            background: "#2563eb",
            fontSize: ".8125rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-.01em",
            marginBottom: "2.5rem",
          }}>
            БС
          </div>

          <h2 style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.25rem",
            lineHeight: 1.4,
            marginBottom: ".75rem",
            letterSpacing: "-.02em",
          }}>
            Личный кабинет клиента
          </h2>
          <p style={{
            color: "#6b7280",
            fontSize: ".875rem",
            lineHeight: 1.65,
          }}>
            Отслеживайте статус дела о банкротстве в режиме реального времени
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            "Статус дела онлайн",
            "Обновления от юриста",
            "Все документы по делу",
          ].map((item) => (
            <div key={item} style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              padding: ".875rem 0",
              borderBottom: "1px solid #1f2937",
              fontSize: ".875rem",
              color: "#9ca3af",
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#16a34a",
                color: "#fff",
                fontSize: ".625rem",
                fontWeight: 700,
                flexShrink: 0,
              }}>✓</span>
              {item}
            </div>
          ))}
        </div>

        <p style={{ fontSize: ".75rem", color: "#374151" }}>
          Банкротство Солюшен © 2024
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Mobile logo */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 6,
              background: "#2563eb",
              fontSize: ".8125rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-.01em",
              marginBottom: "1.25rem",
            }}>
              БС
            </div>
            <h1 style={{
              fontWeight: 700,
              fontSize: "1.125rem",
              letterSpacing: "-.02em",
              color: "#111827",
              marginBottom: ".25rem",
            }}>
              Войти в кабинет
            </h1>
            <p style={{ color: "#6b7280", fontSize: ".875rem" }}>
              Банкротство Солюшен
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Пароль</label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{
                padding: ".625rem .875rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                color: "#ef4444",
                fontSize: ".8125rem",
                fontWeight: 500,
              }} role="alert">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: ".625rem", marginTop: ".25rem", fontSize: ".875rem", fontWeight: 600 }}
            >
              {loading ? "Входим…" : "Войти"}
            </button>
          </form>

          <p style={{
            marginTop: "1.75rem",
            fontSize: ".75rem",
            color: "#9ca3af",
            lineHeight: 1.65,
          }}>
            Доступ только для клиентов агентства.{" "}
            Проблемы со входом?{" "}
            <a href="tel:+79162979645" style={{ color: "#6b7280", fontWeight: 600 }}>+7 (916) 297-96-45</a>
          </p>
        </div>
      </div>
    </div>
  );
}
