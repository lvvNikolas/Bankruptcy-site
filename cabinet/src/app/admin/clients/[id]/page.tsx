import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { CaseStatus } from "@prisma/client";
import { sendStatusChangeEmail, sendUpdateEmail } from "@/lib/email";
import { sendPushToUser } from "@/lib/pushNotify";
import { logAction } from "@/lib/auditLog";
import { UploadForm } from "./UploadForm";

const STATUS_ORDER: CaseStatus[] = ["DOCUMENTS","FILED","COURT","HEARING","DECISION","CLOSED"];

const STATUS_META: Record<CaseStatus, { label: string; desc: string }> = {
  DOCUMENTS: { label: "Сбор документов",  desc: "Подготовка пакета документов" },
  FILED:     { label: "Заявление подано", desc: "Заявление направлено в арбитражный суд" },
  COURT:     { label: "Суд назначен",     desc: "Первое заседание назначено" },
  HEARING:   { label: "Слушание дела",    desc: "Рассмотрение дела в суде" },
  DECISION:  { label: "Решение суда",     desc: "Решение о признании банкротом вынесено" },
  CLOSED:    { label: "Дело закрыто",     desc: "Долги списаны" },
};

const STATUS_DOT: Record<CaseStatus, string> = {
  DOCUMENTS: "#9ca3af",
  FILED:     "#f59e0b",
  COURT:     "#f59e0b",
  HEARING:   "#3b82f6",
  DECISION:  "#3b82f6",
  CLOSED:    "#16a34a",
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
}

type Props = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const adminId    = session.user.id;
  const adminEmail = session.user.email ?? "";

  const { id } = await params;

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
  const currentStep = currentCase ? STATUS_ORDER.indexOf(currentCase.status) : -1;

  const clientInitials = (client.name ?? client.email).slice(0, 2).toUpperCase();
  const cabinetUrl = `${process.env.AUTH_URL}/dashboard`;

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
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
          <Link href="/admin" className="back-link" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".25rem",
            fontSize: ".8125rem",
            color: "var(--text-muted)",
            padding: ".25rem .5rem",
            borderRadius: "var(--radius-sm)",
          }}>
            ← Клиенты
          </Link>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontWeight: 500, fontSize: ".875rem", color: "var(--text)" }}>
            {client.name ?? client.email}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Client info + debt ── */}
        <div className="client-detail-top" style={{
          display: "grid",
          gridTemplateColumns: currentCase?.debtAmount != null ? "1fr 1fr" : "1fr",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}>

          {/* Client card */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <p className="section-label">Клиент</p>
            <div style={{ display: "flex", alignItems: "center", gap: ".875rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 600, fontSize: ".8125rem", color: "#fff",
                flexShrink: 0,
              }}>
                {clientInitials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
                  {client.name ?? "—"}
                </div>
                <div style={{ fontSize: ".8125rem", color: "var(--text-muted)" }}>
                  Клиент с {new Date(client.createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: ".625rem",
                padding: ".5rem .75rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: ".875rem",
              }}>
                <span style={{ color: "var(--text-muted)", fontSize: ".8125rem" }}>@</span>
                <span style={{ color: "var(--text-2)" }}>{client.email}</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: ".625rem",
                padding: ".5rem .75rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: ".875rem",
              }}>
                <span style={{ color: "var(--text-muted)", fontSize: ".8125rem" }}>т</span>
                <span style={{ color: client.phone ? "var(--text-2)" : "var(--text-light)" }}>
                  {client.phone ?? "Телефон не указан"}
                </span>
              </div>
            </div>
          </div>

          {/* Debt card */}
          {currentCase?.debtAmount != null && (
            <div style={{
              borderRadius: "var(--radius)",
              background: "#111827",
              padding: "1.5rem",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div>
                <p style={{
                  fontSize: ".6875rem", fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase", letterSpacing: ".08em",
                  marginBottom: ".625rem",
                }}>
                  Размер долга
                </p>
                <div style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.03em", color: "#fff" }}>
                  {formatMoney(currentCase.debtAmount)}
                </div>
                <div style={{ fontSize: ".8125rem", color: "#6b7280", marginTop: ".375rem" }}>
                  подлежит списанию
                </div>
              </div>

              <div style={{
                marginTop: "1.5rem",
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                padding: ".375rem .75rem",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "var(--radius-sm)",
                fontSize: ".8125rem",
                fontWeight: 500,
                alignSelf: "flex-start",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: STATUS_DOT[currentCase.status],
                  flexShrink: 0, display: "inline-block",
                }} />
                {STATUS_META[currentCase.status].label}
              </div>
            </div>
          )}
        </div>

        {/* ── Edit client info ── */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
          <p className="section-label">Редактировать данные</p>
          <form action={async (formData: FormData) => {
            "use server";
            const name  = (formData.get("name")  as string).trim() || null;
            const phone = (formData.get("phone") as string).trim() || null;
            await db.user.update({ where: { id }, data: { name, phone } });
            await logAction({
              adminId, adminEmail,
              action:   "CLIENT_EDITED",
              targetId: id,
              meta:     { name, phone },
            });
            redirect(`/admin/clients/${id}`);
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: ".75rem", alignItems: "end" }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label" htmlFor="editName">Полное имя</label>
                <input
                  id="editName"
                  name="name"
                  type="text"
                  className="input"
                  defaultValue={client.name ?? ""}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label" htmlFor="editPhone">Телефон</label>
                <input
                  id="editPhone"
                  name="phone"
                  type="tel"
                  className="input"
                  defaultValue={client.phone ?? ""}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              <button className="btn btn-ghost" type="submit" style={{ whiteSpace: "nowrap" }}>
                Сохранить
              </button>
            </div>
          </form>
        </div>

        {/* ── No case state — Feature 4: detailed create form ── */}
        {!currentCase ? (
          <div className="card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <p className="section-label">Создать дело</p>
            <form action={async (formData: FormData) => {
              "use server";
              const title = (formData.get("title") as string).trim()
                || `Банкротство — ${client.name ?? client.email}`;
              const rawDebt = formData.get("debtAmount") as string;
              const debtAmount = rawDebt ? parseFloat(rawDebt.replace(/\s/g, "")) : null;
              const status = (formData.get("status") as CaseStatus) || "DOCUMENTS";
              const created = await db.case.create({
                data: { clientId: id, title, status, debtAmount },
              });
              await logAction({
                adminId, adminEmail,
                action:   "STATUS_CHANGED",
                targetId: created.id,
                meta:     { status, title },
              });
              redirect(`/admin/clients/${id}`);
            }}>
              <div className="case-form-grid" style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto",
                gap: ".75rem",
                alignItems: "end",
              }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="caseTitle">Название дела</label>
                  <input
                    id="caseTitle"
                    name="title"
                    type="text"
                    className="input"
                    placeholder={`Банкротство — ${client.name ?? client.email}`}
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="caseDebt">Долг, ₽</label>
                  <input
                    id="caseDebt"
                    name="debtAmount"
                    type="number"
                    min="0"
                    step="1000"
                    className="input"
                    placeholder="1 500 000"
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="caseStatus">Статус</label>
                  <select id="caseStatus" name="status" defaultValue="DOCUMENTS" className="input">
                    {(Object.keys(STATUS_META) as CaseStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_META[s].label}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" type="submit" style={{ whiteSpace: "nowrap" }}>
                  Создать дело
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* ── Case management ── */}
            <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <p className="section-label">Управление делом</p>

              {/* Stepper */}
              <div className="stepper-wrap" style={{ display: "flex", alignItems: "center", marginBottom: "1.75rem", overflowX: "auto", paddingBottom: ".25rem" }}>
                {STATUS_ORDER.map((s, i) => {
                  const done    = i < currentStep;
                  const current = i === currentStep;
                  const meta    = STATUS_META[s];
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STATUS_ORDER.length - 1 ? "1" : "0 0 auto" }}>
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
                      </div>

                      {i < STATUS_ORDER.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: 1.5,
                          background: done ? "#16a34a" : "var(--border)",
                          margin: "0 .25rem",
                          marginTop: "-1rem",
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Update status/debt form */}
              <form action={async (formData: FormData) => {
                "use server";
                const status   = formData.get("status") as CaseStatus;
                const rawDebt  = formData.get("debtAmount") as string;
                const debtAmount = rawDebt ? parseFloat(rawDebt.replace(/\s/g, "")) : null;

                const rawContract = formData.get("contractAmount") as string;
                const contractAmount = rawContract ? parseFloat(rawContract.replace(/\s/g, "")) : null;
                const rawPaid = formData.get("paidAmount") as string;
                const paidAmount = rawPaid ? parseFloat(rawPaid.replace(/\s/g, "")) : null;

                const nextEventLabel = (formData.get("nextEventLabel") as string).trim() || null;
                const nextEventRaw   = (formData.get("nextEventAt") as string).trim();
                const nextEventAt    = nextEventRaw ? new Date(nextEventRaw) : null;

                const lawyerName  = (formData.get("lawyerName")  as string).trim() || null;
                const lawyerPhone = (formData.get("lawyerPhone") as string).trim() || null;

                await db.case.update({
                  where: { id: currentCase.id },
                  data: { status, debtAmount, contractAmount, paidAmount, nextEventAt, nextEventLabel, lawyerName, lawyerPhone },
                });

                if (status !== currentCase.status) {
                  await logAction({
                    adminId, adminEmail,
                    action:   "STATUS_CHANGED",
                    targetId: currentCase.id,
                    meta:     { from: currentCase.status, to: status },
                  });
                  try {
                    await sendStatusChangeEmail({
                      to: client.email,
                      name: client.name,
                      status: STATUS_META[status].label,
                      caseTitle: currentCase.title,
                      cabinetUrl,
                    });
                  } catch (err) {
                    console.error("Email send failed (status change):", err);
                  }
                  try {
                    await sendPushToUser(
                      client.id,
                      "Статус дела изменён",
                      `Новый статус: ${STATUS_META[status].label}`,
                    );
                  } catch (err) {
                    console.error("Push send failed (status):", err);
                  }
                }

                redirect(`/admin/clients/${id}`);
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".75rem",
                  padding: "1rem",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}>
                  {/* Строка 1: статус + долг */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="status">Статус</label>
                      <select id="status" name="status" defaultValue={currentCase.status} className="input">
                        {(Object.keys(STATUS_META) as CaseStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="debtAmount">Размер долга, ₽</label>
                      <input
                        id="debtAmount" name="debtAmount" type="number" min="0" step="1000"
                        className="input" placeholder="1 500 000"
                        defaultValue={currentCase.debtAmount ?? ""}
                      />
                    </div>
                  </div>

                  {/* Строка 2: ближайшее событие */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="nextEventLabel">Название события</label>
                      <input
                        id="nextEventLabel" name="nextEventLabel" type="text"
                        className="input" placeholder="Судебное заседание"
                        defaultValue={currentCase.nextEventLabel ?? ""}
                      />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="nextEventAt">Дата события</label>
                      <input
                        id="nextEventAt" name="nextEventAt" type="datetime-local"
                        className="input"
                        defaultValue={currentCase.nextEventAt
                          ? new Date(currentCase.nextEventAt.getTime() - currentCase.nextEventAt.getTimezoneOffset() * 60000)
                              .toISOString().slice(0, 16)
                          : ""}
                      />
                    </div>
                  </div>

                  {/* Строка 3: юрист */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="lawyerName">Юрист-куратор</label>
                      <input
                        id="lawyerName" name="lawyerName" type="text"
                        className="input" placeholder="Иванова Мария Сергеевна"
                        defaultValue={currentCase.lawyerName ?? ""}
                      />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="lawyerPhone">Телефон юриста</label>
                      <input
                        id="lawyerPhone" name="lawyerPhone" type="tel"
                        className="input" placeholder="+7 (___) ___-__-__"
                        defaultValue={currentCase.lawyerPhone ?? ""}
                      />
                    </div>
                  </div>

                  {/* Строка 4: финансы */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="contractAmount">Стоимость договора, ₽</label>
                      <input
                        id="contractAmount" name="contractAmount" type="number" min="0" step="1000"
                        className="input" placeholder="150 000"
                        defaultValue={currentCase.contractAmount ?? ""}
                      />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label" htmlFor="paidAmount">Оплачено, ₽</label>
                      <input
                        id="paidAmount" name="paidAmount" type="number" min="0" step="1000"
                        className="input" placeholder="75 000"
                        defaultValue={currentCase.paidAmount ?? ""}
                      />
                    </div>
                  </div>

                  <div>
                    <button className="btn btn-primary" type="submit" style={{ whiteSpace: "nowrap" }}>
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* ── New update ── */}
            <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <p className="section-label">Новое обновление</p>
              <form action={async (formData: FormData) => {
                "use server";
                const text     = (formData.get("text") as string).trim();
                const isPublic = formData.get("isPublic") === "on";
                if (!text) return;
                await db.caseUpdate.create({ data: { caseId: currentCase.id, text, isPublic } });
                await logAction({
                  adminId, adminEmail,
                  action:   "UPDATE_ADDED",
                  targetId: currentCase.id,
                  meta:     { isPublic, preview: text.slice(0, 80) },
                });

                if (isPublic) {
                  // Email
                  try {
                    await sendUpdateEmail({
                      to: client.email,
                      name: client.name,
                      text,
                      caseTitle: currentCase.title,
                      cabinetUrl,
                    });
                  } catch (err) {
                    console.error("Email send failed (update):", err);
                  }
                  // Push
                  try {
                    await sendPushToUser(
                      client.id,
                      "Новое обновление от юриста",
                      text.length > 100 ? text.slice(0, 97) + "…" : text,
                    );
                  } catch (err) {
                    console.error("Push send failed:", err);
                  }
                }

                redirect(`/admin/clients/${id}`);
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                  <textarea
                    name="text"
                    className="input"
                    placeholder="Напишите обновление для клиента — он увидит его в личном кабинете…"
                    rows={3}
                    required
                    style={{ resize: "vertical", lineHeight: 1.6 }}
                  />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{
                      display: "flex", alignItems: "center", gap: ".5rem",
                      fontSize: ".875rem", cursor: "pointer", color: "var(--text-2)",
                      userSelect: "none",
                    }}>
                      <input type="checkbox" name="isPublic" defaultChecked style={{ accentColor: "var(--primary)" }} />
                      Показывать клиенту
                    </label>
                    <button className="btn btn-primary" type="submit" style={{ fontSize: ".8125rem" }}>
                      Отправить
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* ── Updates timeline ── */}
            {currentCase.updates.length > 0 && (
              <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
                <p className="section-label">История обновлений</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {currentCase.updates.map((u, idx) => (
                    <div key={u.id} style={{ display: "flex", gap: ".875rem" }}>
                      {/* Timeline line */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: ".25rem" }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: u.isPublic ? "var(--primary)" : "var(--border)",
                          flexShrink: 0,
                        }} />
                        {idx < currentCase.updates.length - 1 && (
                          <div style={{ width: 1, flex: 1, background: "var(--border)", margin: ".375rem 0" }} />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, paddingBottom: idx < currentCase.updates.length - 1 ? "1.25rem" : 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                          <span style={{ fontSize: ".8125rem", color: "var(--text-muted)" }}>
                            {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                              day: "numeric", month: "long", year: "numeric",
                            })}
                          </span>
                          {!u.isPublic && (
                            <span style={{
                              fontSize: ".6875rem", padding: ".125rem .375rem",
                              borderRadius: 4,
                              background: "var(--bg)",
                              border: "1px solid var(--border)",
                              color: "var(--text-muted)",
                              fontWeight: 500,
                            }}>
                              скрыто
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: ".875rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                          {u.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Feature 2: Document upload ── */}
            <UploadForm
              caseId={currentCase.id}
              documents={currentCase.documents.map(d => ({ id: d.id, name: d.name, url: d.url }))}
            />
          </>
        )}

        {/* ── Feature 5: Delete client ── */}
        <div className="card" style={{ marginTop: "1.5rem", padding: "1.5rem", border: "1px solid #fca5a5" }}>
          <p className="section-label" style={{ color: "var(--danger)" }}>Опасная зона</p>
          <p style={{ fontSize: ".875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            Это действие необратимо — все данные клиента будут удалены
          </p>
          <form action={async () => {
            "use server";
            await logAction({
              adminId, adminEmail,
              action:   "CLIENT_DELETED",
              targetId: id,
              meta:     { name: client.name, email: client.email },
            });
            await db.user.delete({ where: { id } });
            redirect("/admin");
          }}>
            <button className="btn btn-danger" type="submit" style={{ fontSize: ".8125rem" }}>
              Удалить клиента
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
