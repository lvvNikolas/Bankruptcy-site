// Главная панель администратора — список всех клиентов и дел
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { CaseStatus } from "@prisma/client";

// Бейдж-стили для каждого статуса
const STATUS_BADGE: Record<CaseStatus, { label: string; cls: string }> = {
  DOCUMENTS: { label: "Документы",   cls: "badge-gray"   },
  FILED:     { label: "Подано",      cls: "badge-yellow" },
  COURT:     { label: "Суд",         cls: "badge-yellow" },
  HEARING:   { label: "Слушание",    cls: "badge-blue"   },
  DECISION:  { label: "Решение",     cls: "badge-blue"   },
  CLOSED:    { label: "Закрыто",     cls: "badge-green"  },
};

export default async function AdminPage() {
  const session = await auth();

  // Двойная защита — middleware тоже проверяет, но лучше перестраховаться
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  // Загружаем всех клиентов с их делами
  const clients = await db.user.findMany({
    where:   { role: "CLIENT" },
    include: { cases: { orderBy: { startedAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Шапка */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: ".9rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ fontWeight: 700 }}>Панель администратора</div>

        <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
          <Link href="/admin/clients/new" className="btn btn-primary" style={{ fontSize: ".85rem" }}>
            + Новый клиент
          </Link>

          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="btn btn-ghost" type="submit" style={{ fontSize: ".85rem" }}>
              Выйти
            </button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.25rem" }}>
          Клиенты ({clients.length})
        </h1>

        {clients.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            Клиентов пока нет.{" "}
            <Link href="/admin/clients/new">Добавить первого →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card" style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  cursor: "pointer",
                  transition: "box-shadow .15s",
                }}>
                  {/* Инфо о клиенте */}
                  <div>
                    <div style={{ fontWeight: 600 }}>{client.name ?? "—"}</div>
                    <div style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
                      {client.email} {client.phone && `· ${client.phone}`}
                    </div>
                  </div>

                  {/* Дела клиента */}
                  <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {client.cases.length === 0 ? (
                      <span className="badge badge-gray">Нет дел</span>
                    ) : (
                      client.cases.map((c) => {
                        const s = STATUS_BADGE[c.status];
                        return (
                          <span key={c.id} className={`badge ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
