import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { CaseStatus } from "@prisma/client";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { CountdownBadge } from "./CountdownBadge";
import { NotificationButton } from "./NotificationButton";

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

  const userId = session.user.id;

  const [user, caseData] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true, createdAt: true },
    }),
    db.case.findFirst({
      where: { clientId: userId },
      include: {
        updates:   { where: { isPublic: true }, orderBy: { createdAt: "desc" } },
        documents: { orderBy: { uploadedAt: "desc" } },
      },
    }),
  ]);

  const currentStep = caseData ? STATUS_ORDER.indexOf(caseData.status) : -1;
  const progressPct = caseData
    ? Math.round(((currentStep + 1) / STATUS_ORDER.length) * 100)
    : 0;

  const displayName  = user?.name ?? session.user.email ?? "Клиент";
  const nameParts    = displayName.split(" ");
  // ФИО: [0]=Фамилия [1]=Имя [2]=Отчество — берём Имя, если есть
  const firstName    = nameParts.length > 1 ? nameParts[1] : nameParts[0];
  const avatarLetter = displayName[0].toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Header ── */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1rem",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: ".5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".625rem", minWidth: 0 }}>
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
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontWeight: 600, fontSize: ".9375rem", color: "var(--text)", lineHeight: 1.2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {displayName}
            </div>
            <div className="header-subtitle" style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
              Личный кабинет
            </div>
          </div>
        </div>

        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }} style={{ flexShrink: 0 }}>
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
            {/* ── Hero card ── */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1a2e4a 55%, #1e3a8a 100%)",
              borderRadius: "var(--radius)",
              padding: "1.75rem 2rem",
              marginBottom: "1rem",
              position: "relative",
              overflow: "hidden",
              color: "#fff",
            }}>
              {/* Декоративные кружки */}
              <div style={{
                position: "absolute", top: -50, right: -50,
                width: 200, height: 200, borderRadius: "50%",
                background: "rgba(59,130,246,.1)", pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: -70, right: 60,
                width: 150, height: 150, borderRadius: "50%",
                background: "rgba(37,99,235,.07)", pointerEvents: "none",
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Приветствие */}
                <p style={{ fontSize: ".8125rem", color: "#93c5fd", fontWeight: 500, marginBottom: ".2rem" }}>
                  Добрый день
                </p>
                <h1 style={{
                  fontWeight: 700, fontSize: "1.625rem", letterSpacing: "-.03em",
                  color: "#fff", marginBottom: "1.5rem",
                }}>
                  {firstName}
                </h1>

                {/* Долг + статус */}
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                  {caseData.debtAmount != null && (
                    <div>
                      <div style={{ fontSize: ".6875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".25rem" }}>
                        Долг к списанию
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1 }}>
                        {formatMoney(caseData.debtAmount)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: ".6875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".375rem" }}>
                      Статус
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: ".4rem",
                      padding: ".3rem .75rem",
                      background: "rgba(255,255,255,.08)",
                      border: "1px solid rgba(255,255,255,.12)",
                      borderRadius: 99,
                      fontSize: ".8125rem", fontWeight: 500, color: "#e2e8f0",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", display: "inline-block", flexShrink: 0 }} />
                      {STATUS_META[caseData.status].label}
                    </div>
                  </div>
                </div>

                {/* Прогресс */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".4rem" }}>
                    <span style={{ fontSize: ".75rem", color: "#94a3b8" }}>Прогресс дела</span>
                    <span style={{ fontSize: ".75rem", color: "#93c5fd", fontWeight: 600 }}>{progressPct}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,.1)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${progressPct}%`,
                      background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                      borderRadius: 99,
                    }} />
                  </div>
                </div>

                {/* Countdown */}
                {caseData.nextEventAt && (
                  <CountdownBadge
                    eventAt={caseData.nextEventAt.toISOString()}
                    label={caseData.nextEventLabel ?? "Ближайшее событие"}
                  />
                )}
              </div>
            </div>

            {/* ── Ваши данные (компактно) ── */}
            <div className="card" style={{ padding: "1.125rem 1.5rem", marginBottom: "1rem" }}>
              <p className="section-label">Ваши данные</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem .75rem" }}>
                <InfoItem icon="👤" label="Имя"      value={user?.name ?? "—"} />
                <InfoItem icon="✉️"  label="Email"    value={user?.email ?? "—"} />
                <InfoItem icon="📞" label="Телефон"  value={user?.phone ?? "—"} />
                <InfoItem icon="📅" label="Клиент с" value={
                  new Date(user!.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
                } />
              </div>
            </div>

            {/* ── Этапы дела ── */}
            <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <p className="section-label" style={{ marginBottom: "1.25rem" }}>Этапы дела</p>

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
                    <div key={doc.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: ".625rem",
                      padding: ".5rem .75rem",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                    }}>
                      <span style={{ fontSize: ".875rem", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.name}
                      </span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost"
                        style={{ fontSize: ".75rem", padding: ".25rem .625rem", flexShrink: 0 }}
                      >
                        Открыть
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* ── Юрист-куратор ── */}
          {caseData.lawyerName && (
            <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <p className="section-label">Ваш юрист</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#dbeafe", color: "#1d4ed8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: ".875rem", flexShrink: 0,
                }}>
                  {caseData.lawyerName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--text)" }}>
                    {caseData.lawyerName}
                  </div>
                  {caseData.lawyerPhone && (
                    <a
                      href={`tel:${caseData.lawyerPhone}`}
                      style={{ fontSize: ".875rem", color: "var(--primary)", textDecoration: "none", marginTop: ".125rem", display: "block" }}
                    >
                      {caseData.lawyerPhone}
                    </a>
                  )}
                </div>
                {caseData.lawyerPhone && (
                  <a
                    href={`tel:${caseData.lawyerPhone}`}
                    className="btn btn-ghost"
                    style={{ fontSize: ".8125rem", flexShrink: 0 }}
                  >
                    Позвонить
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ── Финансы ── */}
          {caseData.contractAmount != null && (
            <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <p className="section-label">Оплата по договору</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
                <FinRow label="Стоимость договора" value={formatMoney(caseData.contractAmount)} />
                {caseData.paidAmount != null && (
                  <>
                    <FinRow label="Оплачено" value={formatMoney(caseData.paidAmount)} accent="#16a34a" />
                    <FinRow
                      label="Остаток"
                      value={formatMoney(Math.max(0, caseData.contractAmount - caseData.paidAmount))}
                      accent={caseData.paidAmount >= caseData.contractAmount ? "#16a34a" : "#dc2626"}
                    />
                    <div style={{ marginTop: ".25rem" }}>
                      <div style={{
                        height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.min(100, Math.round((caseData.paidAmount / caseData.contractAmount) * 100))}%`,
                          background: "#16a34a",
                          borderRadius: 99,
                          transition: "width .3s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: ".375rem" }}>
                        {Math.min(100, Math.round((caseData.paidAmount / caseData.contractAmount) * 100))}% оплачено
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          </>
        )}

        {/* ── Push-уведомления ── */}
        <div style={{ marginBottom: "1rem" }}>
          <NotificationButton />
        </div>

        {/* ── Редактирование профиля ── */}
        <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
          <p className="section-label">Редактировать профиль</p>
          <form action={async (formData: FormData) => {
            "use server";
            const name  = (formData.get("name")  as string).trim() || null;
            const phone = (formData.get("phone") as string).trim() || null;
            await db.user.update({ where: { id: userId }, data: { name, phone } });
            redirect("/dashboard");
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: ".75rem", alignItems: "end" }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label" htmlFor="pName">Полное имя</label>
                <input id="pName" name="name" type="text" className="input"
                  defaultValue={user?.name ?? ""} placeholder="Иванов Иван Иванович" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label" htmlFor="pPhone">Телефон</label>
                <input id="pPhone" name="phone" type="tel" className="input"
                  defaultValue={user?.phone ?? ""} placeholder="+7 (___) ___-__-__" />
              </div>
              <button className="btn btn-ghost" type="submit" style={{ whiteSpace: "nowrap" }}>
                Сохранить
              </button>
            </div>
          </form>
        </div>

        {/* ── Смена пароля ── */}
        <ChangePasswordForm />

      </main>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".125rem" }}>
      <span style={{ fontSize: ".6875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: ".25rem" }}>
        <span style={{ fontSize: ".625rem" }}>{icon}</span> {label}
      </span>
      <span style={{
        fontSize: ".875rem", fontWeight: 500, color: "var(--text-2)",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {value}
      </span>
    </div>
  );
}

function FinRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: ".875rem" }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: accent ?? "var(--text)" }}>{value}</span>
    </div>
  );
}
