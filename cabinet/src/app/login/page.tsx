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

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // обрабатываем редирект сами
    });

    setLoading(false);

    if (res?.error) {
      setError("Неверный email или пароль");
      return;
    }

    // Перезагружаем — middleware сделает редирект на нужный дашборд
    router.refresh();
    router.push("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>
        {/* Шапка */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: ".85rem", color: "var(--text-muted)", marginBottom: ".5rem" }}>
            Юридическое агентство по банкротству Солюшен
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Личный кабинет</h1>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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

          {/* Ошибка авторизации */}
          {error && (
            <div style={{
              padding: ".6rem .85rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "var(--radius)",
              color: "var(--danger)",
              fontSize: ".875rem",
            }} role="alert">
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: ".25rem" }}>
            {loading ? "Входим…" : "Войти"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: ".8rem", color: "var(--text-muted)" }}>
          Доступ только для клиентов агентства.
          <br />Проблемы со входом?{" "}
          <a href="tel:+79162979645">+7 (916) 297-96-45</a>
        </p>
      </div>
    </div>
  );
}
