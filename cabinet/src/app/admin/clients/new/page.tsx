"use client";

// Страница создания нового клиента администратором
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Ошибка создания клиента");
      return;
    }

    // Переходим на страницу созданного клиента
    router.push(`/admin/clients/${json.id}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Шапка */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: ".9rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>
        <Link href="/admin" style={{ color: "var(--text-muted)", fontSize: ".85rem" }}>
          ← Все клиенты
        </Link>
        <div style={{ fontWeight: 700 }}>Новый клиент</div>
      </header>

      <main style={{ maxWidth: 480, margin: "2rem auto", padding: "0 1rem" }}>
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>Данные клиента</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="field">
              <label className="label" htmlFor="name">Имя</label>
              <input
                id="name"
                className="input"
                placeholder="Иванов Иван Иванович"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="client@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="phone">Телефон</label>
              <input
                id="phone"
                className="input"
                type="tel"
                placeholder="+7XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Пароль для входа</label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>
                Клиент получит этот пароль и сможет войти в кабинет
              </span>
            </div>

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

            <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Создаём…" : "Создать клиента"}
              </button>
              <Link href="/admin" className="btn btn-ghost">Отмена</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
