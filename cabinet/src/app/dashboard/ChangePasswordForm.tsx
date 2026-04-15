"use client";
import { useState } from "react";

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setStatus("error");
      setErrorMsg("Новый пароль должен быть не менее 6 символов");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Ошибка");
    }
  }

  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <button
        type="button"
        onClick={() => { setOpen(!open); setStatus("idle"); setErrorMsg(""); }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          width: "100%",
          textAlign: "left",
        }}
      >
        <p className="section-label" style={{ marginBottom: 0 }}>Сменить пароль</p>
        <span style={{ marginLeft: "auto", fontSize: ".75rem", color: "var(--text-muted)" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div className="field">
              <label className="label" htmlFor="currentPassword">Текущий пароль</label>
              <input
                id="currentPassword"
                type="password"
                className="input"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="newPassword">Новый пароль</label>
              <input
                id="newPassword"
                type="password"
                className="input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {status === "success" && (
              <p style={{ fontSize: ".8125rem", color: "var(--success)" }}>Пароль успешно изменён</p>
            )}
            {status === "error" && (
              <p style={{ fontSize: ".8125rem", color: "var(--danger)" }}>{errorMsg}</p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={status === "loading"}
                style={{ fontSize: ".8125rem" }}
              >
                {status === "loading" ? "Сохранение…" : "Сохранить пароль"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
