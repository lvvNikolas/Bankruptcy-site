import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { CaseStatus } from "@prisma/client";
import { ChangePasswordForm } from "./ChangePasswordForm";

const STATUS_ORDER: CaseStatus[] = [
  "DOCUMENTS", "FILED", "COURT", "HEARING", "DECISION", "CLOSED",
];

const STATUS_META: Record<CaseStatus, { label: string; desc: string }> = {
  DOCUMENTS: { label: "Документы",        desc: "Сбор и подготовка документов" },
  FILED:     { label: "Заявление подано", desc: "Заявление направлено в суд" },
  COURT:     { label: "Суд назначен",     desc: "Судебное заседание назначено" },
  HEARING:   { label: "Слушание",         desc: "Рассмотрение дела в суде" },
  DECISION:  { label: "Решение суда",     desc: "Решение суда вынесено" },
  CLOSED:    { label: "Дело закрыто",     desc: "Долги списаны" },
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  const caseData = await db.case.findFirst({
    where: { clientId: session.user.id },
    include: {
      updates:   { where: { isPublic: true }, orderBy: { createdAt: "desc" } },
      documents: { orderBy: { uploadedAt: "desc" } },
    },
  });

  const currentStep = caseData ? STATUS_ORDER.indexOf(caseData.status) : -1;
  const progressPct = caseData
    ? Math.round(((currentStep + 1) / STATUS_ORDER.length) * 100)
    : 0;

  const displayName = user?.name ?? session.user.email ?? "Клиент";
  const firstName   = displayName.split(" ")[0];
  const avatarLetter = displayName[0].toUpperCase();

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
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 600, fontSize: ".8125rem",
            flexShrink: 0,
          }}>
            {avatarLetter}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--text)", lineHeight: 1.2 }}>
              {displayName}
            </div>
            <div style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
              Личный кабинет
            </div>
          </div>
        </div>

        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}>
          <button className="btn btn-ghost" type="submit" style={{ fontSize: ".8125rem" }}>
            Выйти
          </button>
        </form>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {!caseData ? (
          <div className="card" style={{ textAlign: "center", padding: "3.5rem 2rem" }}>
            <div style={{ fontSize: ".875rem", fontWeight: 500, color: "var(--text)", marginBottom: ".5rem" }}>
              Дело оформляется
            </div>
            <p style={{ color: "var(--text-muted)", maxWidth: 320, margin: "0 auto 1.25rem", fontSize: ".875rem", lineHeight: 1.65 }}>
              Ваш юрист скоро создаст карточку дела. Обычно это занимает 1–2 рабочих дня.
            </p>
            <a href="tel:+79162979645" className="btn btn-primary" style={{ fontSize: ".875rem" }}>
              Позвонить юристу
            </a>
          </div>
        ) : (
          <>
            {/* ── Hero greeting ── */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{
                fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-.02em",
                color: "var(--text)", marginBottom: ".25rem",
              }}>
                Добрый день, {firstName}
              </h1>
              <p style={{ fontSize: ".875rem", color: "var(--text-muted)" }}>
                {caseData.title}
              </p>
            </div>

            {/* ── Info cards ── */}
            <div className="dashboard-info-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}>
              {/* Client info */}
              <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
                <p className="section-label">Ваши данные</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                  <Row label="Имя"      value={user?.name ?? "—"} />
                  <Row label="Email"    value={user?.email ?? "—"} />
                  <Row label="Телефон"  value={user?.phone ?? "—"} />
                  <Row label="Клиент с" value={
                    new Date(user!.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  } />
                </div>
              </div>

              {/* Debt */}
              <div style={{
                borderRadius: "var(--radius)",
                background: "#111827",
                padding: "1.25rem 1.5rem",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
                <p style={{
                  fontSize: ".6875rem", fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase", letterSpacing: ".08em",
                  marginBottom: ".625rem",
                }}>
                  Размер долга
                </p>
                <div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-.03em" }}>
                    {caseData.debtAmount != null ? formatMoney(caseData.debtAmount) : "—"}
                  </div>
                  {caseData.debtAmount != null && (
                    <div style={{ fontSize: ".8125rem", color: "#6b7280", marginTop: ".25rem" }}>
                      подлежит списанию
                    </div>
                  )}
                </div>
                <div style={{
                  marginTop: "1rem",
                  padding: ".375rem .75rem",
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: ".8125rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  alignSelf: "flex-start",
                  color: "#e5e7eb",
                  fontWeight: 500,
                }}>
                  {STATUS_META[caseData.status].label}
                </div>
              </div>
            </div>

            {/* ── Case progress ── */}
            <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <p className="section-label" style={{ marginBottom: 0 }}>Прогресс дела</p>
                <span style={{ fontSize: ".8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {progressPct}%
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 3,
                background: "var(--border)",
                borderRadius: 99,
                marginBottom: "1.5rem",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "#2563eb",
                  borderRadius: 99,
                }} />
              </div>

              {/* Steps — horizontal stepper */}
              <div className="stepper-wrap" style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: ".25rem" }}>
                {STATUS_ORDER.map((status, i) => {
                  const done    = i < currentStep;
                  const current = i === currentStep;
                  const meta    = STATUS_META[status];
                  return (
                    <div key={status} style={{ display: "flex", alignItems: "flex-start", flex: i < STATUS_ORDER.length - 1 ? "1" : "0 0 auto" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".375rem", minWidth: 72 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 600, fontSize: ".6875rem",
                          background: done    ? "#16a34a"
                                    : current ? "#2563eb"
                                    : "var(--bg)",
                          color: done || current ? "#fff" : "var(--text-light)",
                          border: done || current ? "none" : "1.5px solid var(--border)",
                          flexShrink: 0,
                        }}>
                          {done ? "✓" : i + 1}
                        </div>
                        <span style={{
                          fontSize: ".625rem", fontWeight: 500, textAlign: "center", lineHeight: 1.3,
                          color: done    ? "#16a34a"
                               : current ? "#2563eb"
                               : "var(--text-light)",
                          whiteSpace: "nowrap",
                        }}>
                          {meta.label}
                        </span>
                        {current && (
                          <span style={{
                            fontSize: ".625rem", color: "var(--text-muted)",
                            textAlign: "center", lineHeight: 1.3, maxWidth: 72,
                            whiteSpace: "normal",
                          }}>
                            {meta.desc}
                          </span>
                        )}
                      </div>

                      {i < STATUS_ORDER.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: 1.5,
                          background: done ? "#16a34a" : "var(--border)",
                          margin: "0 .25rem",
                          marginTop: "calc(28px / 2 - 0.75px)",
                          flexShrink: 0,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Updates from lawyer ── */}
            {caseData.updates.length > 0 && (
              <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
                <p className="section-label">Обновления от юриста</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {caseData.updates.map((u, idx) => (
                    <div key={u.id} style={{ display: "flex", gap: ".875rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: ".25rem" }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: "#2563eb",
                          flexShrink: 0,
                        }} />
                        {idx < caseData.updates.length - 1 && (
                          <div style={{ width: 1, flex: 1, background: "var(--border)", margin: ".375rem 0" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, paddingBottom: idx < caseData.updates.length - 1 ? "1.125rem" : 0 }}>
                        <div style={{ fontSize: ".8125rem", color: "var(--text-muted)", marginBottom: ".25rem" }}>
                          {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </div>
                        <div style={{ fontSize: ".875rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                          {u.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Documents ── */}
            {caseData.documents.length > 0 && (
              <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
                <p className="section-label">Документы</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
                  {caseData.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".625rem",
                        padding: ".5rem .75rem",
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: ".875rem",
                        color: "var(--text-2)",
                        transition: "border-color .15s ease, background .15s ease",
                      }}
                    >
                      <span style={{ fontSize: ".875rem", color: "var(--text-muted)" }}>↗</span>
                      {doc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Feature 3: Change password ── */}
        <ChangePasswordForm />

      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: ".875rem" }}>
      <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, color: "var(--text-2)", textAlign: "right" }}>{value}</span>
    </div>
  );
}
