"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FIELDS = [
  { id: "name",     label: "Полное имя",      type: "text",     placeholder: "Иванов Иван Иванович", required: true },
  { id: "email",    label: "Email",            type: "email",    placeholder: "client@email.com",     required: true },
  { id: "phone",    label: "Телефон",          type: "tel",      placeholder: "+7 (___) ___-__-__",  required: false },
  { id: "password", label: "Пароль для входа", type: "password", placeholder: "Минимум 6 символов",  required: true, minLength: 6 },
] as const;

type FieldId = typeof FIELDS[number]["id"];

export default function NewClientPage() {
  const router = useRouter();
  const [values, setValues]   = useState<Record<FieldId, string>>({ name: "", email: "", phone: "", password: "" });
  const [error,  setError]    = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (id: FieldId) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [id]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res  = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) { setError(json.error ?? "Ошибка создания клиента"); return; }
    router.push(`/admin/clients/${json.id}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Header */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        height: 52,
        display: "flex",
        alignItems: "center",
        gap: ".375rem",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <Link href="/admin" style={{
          fontSize: ".8125rem",
          color: "var(--text-muted)",
          display: "inline-flex", alignItems: "center", gap: ".25rem",
          padding: ".25rem .5rem",
          borderRadius: "var(--radius-sm)",
          transition: "color .15s ease",
        }}>
          ← Клиенты
        </Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontWeight: 500, fontSize: ".875rem", color: "var(--text)" }}>Новый клиент</span>
      </header>

      <main style={{ maxWidth: 480, margin: "2.5rem auto", padding: "0 1.5rem" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-.02em", color: "var(--text)", marginBottom: ".25rem" }}>
            Добавить клиента
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: ".875rem" }}>
            Клиент получит доступ в личный кабинет по указанным данным
          </p>
        </div>

        <div className="card" style={{ padding: "1.75rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {FIELDS.map(f => (
              <div className="field" key={f.id}>
                <label className="label" htmlFor={f.id}>{f.label}</label>
                <input
                  id={f.id}
                  className="input"
                  type={f.type}
                  placeholder={f.placeholder}
                  required={f.required}
                  minLength={"minLength" in f ? f.minLength : undefined}
                  value={values[f.id]}
                  onChange={set(f.id)}
                />
                {f.id === "password" && (
                  <span style={{ fontSize: ".75rem", color: "var(--text-light)", marginTop: ".125rem" }}>
                    Клиент сможет войти в кабинет по этому паролю
                  </span>
                )}
              </div>
            ))}

            {error && (
              <div style={{
                padding: ".625rem .875rem",
                background: "var(--danger-bg)",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-sm)",
                color: "var(--danger)",
                fontSize: ".8125rem",
                fontWeight: 500,
              }} role="alert">
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: ".625rem", marginTop: ".25rem" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ flex: 1, fontWeight: 600 }}
              >
                {loading ? "Создаём…" : "Создать клиента"}
              </button>
              <Link href="/admin" className="btn btn-ghost">
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
