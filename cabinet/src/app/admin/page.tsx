import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { CaseStatus, Prisma } from "@prisma/client";
import { Suspense } from "react";
import { SearchBar } from "./SearchBar";
import { ACTION_LABELS, type AuditAction } from "@/lib/auditLog";

const STATUS_META: Record<CaseStatus, { label: string; color: string }> = {
  DOCUMENTS: { label: "Документы",    color: "#9ca3af" },
  FILED:     { label: "Подано",       color: "#f59e0b" },
  COURT:     { label: "Суд назначен", color: "#f59e0b" },
  HEARING:   { label: "Слушание",     color: "#3b82f6" },
  DECISION:  { label: "Решение",      color: "#3b82f6" },
  CLOSED:    { label: "Закрыто",      color: "#16a34a" },
};

const AVATAR_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];

function avatarColor(email: string) {
  let h = 0;
  for (const c of email) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "RUB", maximumFractionDigits: 0,
  }).format(n);
}

const PAGE_SIZE = 15;

type Props = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const { q, status, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));

  // Build Prisma where clause for filtering
  const where: Prisma.UserWhereInput = {
    role: "CLIENT",
    ...(q ? {
      OR: [
        { name:  { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    } : {}),
    ...(status ? {
      cases: { some: { status: status as CaseStatus } },
    } : {}),
  };

  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const [clients, totalFiltered, totalClients, debtResult, activeCases, closedCases] = await Promise.all([
    db.user.findMany({
      where,
      include: { cases: { orderBy: { startedAt: "desc" } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.user.count({ where }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.case.aggregate({ _sum: { debtAmount: true } }),
    db.user.count({ where: { role: "CLIENT", cases: { some: { status: { not: "CLOSED" } } } } }),
    db.user.count({ where: { role: "CLIENT", cases: { some: { status: "CLOSED" } } } }),
  ]);

  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);
  const totalDebt  = debtResult._sum.debtAmount ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Header ── */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#2563eb",
            fontSize: ".6875rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-.01em",
            flexShrink: 0,
          }}>БС</div>
          <span style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--text)" }}>
            Банкротство Солюшен
          </span>
          <span style={{
            fontSize: ".6875rem",
            fontWeight: 500,
            padding: ".125rem .5rem",
            borderRadius: 4,
            background: "var(--bg)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}>
            Администратор
          </span>
        </div>

        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href="/admin/clients/new" className="btn btn-primary" style={{ fontSize: ".8125rem" }}>
            + Новый клиент
          </Link>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="btn btn-ghost" type="submit" style={{ fontSize: ".8125rem" }}>
              Выйти
            </button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Stats ── */}
        <div className="stats-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          {/* Clients */}
          <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div className="section-label" style={{ marginBottom: ".5rem" }}>Клиентов</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, color: "var(--text)", letterSpacing: "-.03em" }}>
              {totalClients}
            </div>
            <div style={{ fontSize: ".8125rem", color: "var(--text-muted)", marginTop: ".375rem" }}>
              {closedCases > 0 ? `${closedCases} дел закрыто` : "Все дела в работе"}
            </div>
          </div>

          {/* Active */}
          <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div className="section-label" style={{ marginBottom: ".5rem" }}>В работе</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, color: "#2563eb", letterSpacing: "-.03em" }}>
              {activeCases}
            </div>
            <div style={{ fontSize: ".8125rem", color: "var(--text-muted)", marginTop: ".375rem" }}>
              активных дел
            </div>
          </div>

          {/* Debt */}
          <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div className="section-label" style={{ marginBottom: ".5rem" }}>Общий долг</div>
            <div style={{ fontSize: totalDebt > 0 ? "1.25rem" : "1.75rem", fontWeight: 700, lineHeight: 1, color: "var(--text)", letterSpacing: "-.02em" }}>
              {totalDebt > 0 ? formatMoney(totalDebt) : "—"}
            </div>
            <div style={{ fontSize: ".8125rem", color: "var(--text-muted)", marginTop: ".375rem" }}>
              к списанию
            </div>
          </div>
        </div>

        {/* ── Clients table ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".875rem" }}>
          <h2 style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--text)" }}>Клиенты</h2>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <span style={{ fontSize: ".8125rem", color: "var(--text-muted)" }}>
              {totalFiltered} {totalFiltered === 1 ? "клиент" : totalFiltered < 5 ? "клиента" : "клиентов"}
            </span>
            <a href="/api/admin/export" className="btn btn-ghost" style={{ fontSize: ".75rem", padding: ".25rem .625rem" }}>
              ↓ CSV
            </a>
          </div>
        </div>

        {/* Feature 6: Search bar */}
        <Suspense fallback={<div style={{ height: 36 }} />}>
          <SearchBar defaultQ={q ?? ""} defaultStatus={status ?? ""} />
        </Suspense>

        {clients.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.125rem",
              marginBottom: "1rem",
            }}>
              👤
            </div>
            <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: ".375rem" }}>
              {q || status ? "Ничего не найдено" : "Нет клиентов"}
            </h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem", fontSize: ".875rem" }}>
              {q || status
                ? "Попробуйте изменить параметры поиска"
                : "Добавьте первого клиента, чтобы начать работу"}
            </p>
            {!q && !status && (
              <Link href="/admin/clients/new" className="btn btn-primary">
                + Добавить клиента
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 1fr 1.25fr 1.25fr 2rem",
              padding: ".5rem 1.5rem",
              background: "var(--bg)",
              borderBottom: "1px solid var(--border)",
              fontSize: ".6875rem",
              fontWeight: 600,
              color: "var(--text-light)",
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}>
              <div>Клиент</div>
              <div className="table-head-phone">Телефон</div>
              <div>Долг</div>
              <div>Статус</div>
              <div />
            </div>

            {/* Rows */}
            {clients.map((client, idx) => {
              const activeCase = client.cases[0] ?? null;
              const meta = activeCase ? STATUS_META[activeCase.status] : null;
              const isLast = idx === clients.length - 1;
              const color = avatarColor(client.email);

              return (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div className="client-row" style={{
                    display: "grid",
                    gridTemplateColumns: "2.5fr 1fr 1.25fr 1.25fr 2rem",
                    padding: ".875rem 1.5rem",
                    alignItems: "center",
                    borderBottom: isLast ? "none" : "1px solid var(--border)",
                    cursor: "pointer",
                  }}>
                    {/* Avatar + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 600, fontSize: ".6875rem", color: "#fff",
                        flexShrink: 0,
                      }}>
                        {initials(client.name, client.email)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: ".875rem", color: "var(--text)" }}>
                          {client.name ?? "—"}
                        </div>
                        <div style={{ fontSize: ".8125rem", color: "var(--text-muted)" }}>
                          {client.email}
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="table-cell-phone" style={{ fontSize: ".875rem", color: "var(--text-2)" }}>
                      {client.phone ?? <span style={{ color: "var(--text-light)" }}>—</span>}
                    </div>

                    {/* Debt */}
                    <div style={{ fontWeight: 500, fontSize: ".875rem", color: "var(--text)" }}>
                      {activeCase?.debtAmount != null
                        ? formatMoney(activeCase.debtAmount)
                        : <span style={{ color: "var(--text-light)", fontWeight: 400 }}>—</span>
                      }
                    </div>

                    {/* Status */}
                    <div>
                      {meta ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".8125rem", color: "var(--text-2)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, display: "inline-block", flexShrink: 0 }} />
                          {meta.label}
                        </span>
                      ) : (
                        <span style={{ fontSize: ".8125rem", color: "var(--text-light)" }}>Нет дела</span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div style={{ color: "var(--text-light)", fontSize: ".875rem" }}>→</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {/* ── Pagination ── */}
        {totalPages > 1 && (() => {
          const buildHref = (p: number) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (status) params.set("status", status);
            params.set("page", String(p));
            return `/admin?${params.toString()}`;
          };
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", marginTop: "1rem" }}>
              {page > 1 && (
                <a href={buildHref(page - 1)} className="btn btn-ghost" style={{ fontSize: ".8125rem" }}>← Назад</a>
              )}
              <span style={{ fontSize: ".8125rem", color: "var(--text-muted)", padding: "0 .5rem" }}>
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <a href={buildHref(page + 1)} className="btn btn-ghost" style={{ fontSize: ".8125rem" }}>Вперёд →</a>
              )}
            </div>
          );
        })()}

        {/* ── Audit log ── */}
        {auditLogs.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--text)", marginBottom: ".875rem" }}>
              Журнал действий
            </h2>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}>
              {auditLogs.map((log, idx) => {
                const label = ACTION_LABELS[log.action as AuditAction] ?? log.action;
                const isLast = idx === auditLogs.length - 1;
                const meta = log.meta ? (() => { try { return JSON.parse(log.meta) as Record<string, unknown>; } catch { return null; } })() : null;

                return (
                  <div key={log.id} style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: ".75rem",
                    padding: ".75rem 1.5rem",
                    alignItems: "center",
                    borderBottom: isLast ? "none" : "1px solid var(--border)",
                    fontSize: ".875rem",
                  }}>
                    <span style={{
                      display: "inline-block",
                      width: 7, height: 7, borderRadius: "50%",
                      background: log.action.includes("DELETED") ? "var(--danger)"
                               : log.action.includes("CREATED") ? "var(--success)"
                               : "var(--primary)",
                      flexShrink: 0,
                    }} />
                    <div>
                      <span style={{ fontWeight: 500, color: "var(--text)" }}>{label}</span>
                      {meta && (
                        <span style={{ color: "var(--text-muted)", marginLeft: ".5rem" }}>
                          {meta.name as string ?? meta.email as string ?? meta.to as string ?? ""}
                          {meta.from && meta.to ? ` ${String(meta.from)} → ${String(meta.to)}` : ""}
                        </span>
                      )}
                      <span style={{ color: "var(--text-light)", marginLeft: ".5rem", fontSize: ".8125rem" }}>
                        · {log.adminEmail}
                      </span>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: ".8125rem", whiteSpace: "nowrap" }}>
                      {new Date(log.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
