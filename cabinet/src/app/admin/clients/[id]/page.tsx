// Страница клиента в панели администратора
// Позволяет: менять статус дела, добавлять обновления, видеть документы
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { CaseStatus } from "@prisma/client";

const STATUS_LABELS: Record<CaseStatus, string> = {
  DOCUMENTS: "Сбор документов",
  FILED:     "Заявление подано",
  COURT:     "Судебное заседание",
  HEARING:   "Слушание дела",
  DECISION:  "Решение суда",
  CLOSED:    "Дело закрыто",
};

type Props = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  // Загружаем клиента со всеми делами, обновлениями и документами
  const client = await db.user.findUnique({
    where: { id },
    include: {
      cases: {
        include: {
          updates:   { orderBy: { createdAt: "desc" } },
          documents: { orderBy: { uploadedAt: "desc" } },
        },
        orderBy: { startedAt: "desc" },
      },
    },
  });

  if (!client || client.role !== "CLIENT") notFound();

  const currentCase = client.cases[0] ?? null;

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
        <div style={{ fontWeight: 700 }}>{client.name ?? client.email}</div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Контакты клиента */}
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: ".75rem" }}>Данные клиента</h2>
          <div style={{ display: "grid", gap: ".4rem", fontSize: ".9rem" }}>
            <div><b>Email:</b> {client.email}</div>
            <div><b>Телефон:</b> {client.phone ?? "—"}</div>
            <div><b>Клиент с:</b> {new Date(client.createdAt).toLocaleDateString("ru-RU")}</div>
          </div>
        </div>

        {!currentCase ? (
          // Дело ещё не создано
          <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              У клиента нет дела
            </p>
            {/* Server Action — создать дело */}
            <form action={async () => {
              "use server";
              await db.case.create({
                data: {
                  clientId: id,
                  title:    `Банкротство — ${client.name ?? client.email}`,
                  status:   "DOCUMENTS",
                },
              });
              redirect(`/admin/clients/${id}`);
            }}>
              <button className="btn btn-primary" type="submit">
                Создать дело
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Статус дела */}
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>
                {currentCase.title}
              </h3>

              {/* Форма смены статуса */}
              <form action={async (formData: FormData) => {
                "use server";
                const status = formData.get("status") as CaseStatus;
                await db.case.update({
                  where: { id: currentCase.id },
                  data:  { status },
                });
                redirect(`/admin/clients/${id}`);
              }} style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
                <select
                  name="status"
                  defaultValue={currentCase.status}
                  className="input"
                  style={{ flex: "1 1 200px" }}
                >
                  {(Object.keys(STATUS_LABELS) as CaseStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button className="btn btn-primary" type="submit">
                  Сохранить статус
                </button>
              </form>
            </div>

            {/* Добавить обновление */}
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Добавить обновление</h3>

              <form action={async (formData: FormData) => {
                "use server";
                const text     = (formData.get("text") as string).trim();
                const isPublic = formData.get("isPublic") === "on";
                if (!text) return;
                await db.caseUpdate.create({
                  data: { caseId: currentCase.id, text, isPublic },
                });
                redirect(`/admin/clients/${id}`);
              }} style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                <textarea
                  name="text"
                  className="input"
                  placeholder="Текст обновления для клиента…"
                  rows={3}
                  required
                  style={{ resize: "vertical" }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".875rem" }}>
                  <input type="checkbox" name="isPublic" defaultChecked />
                  Показывать клиенту
                </label>
                <button className="btn btn-primary" type="submit" style={{ alignSelf: "flex-start" }}>
                  Добавить
                </button>
              </form>
            </div>

            {/* История обновлений */}
            {currentCase.updates.length > 0 && (
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>История обновлений</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".85rem" }}>
                  {currentCase.updates.map((u) => (
                    <li key={u.id} style={{
                      paddingLeft: "1rem",
                      borderLeft: `3px solid ${u.isPublic ? "var(--primary)" : "var(--border)"}`,
                    }}>
                      <div style={{ fontSize: ".78rem", color: "var(--text-muted)", marginBottom: ".15rem" }}>
                        {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                        {!u.isPublic && " · только для администратора"}
                      </div>
                      <div style={{ fontSize: ".9rem" }}>{u.text}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
