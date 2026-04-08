// Дашборд клиента — отображает статус его дела, обновления и документы
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { signOut } from "@/auth";
import { CaseStatus } from "@prisma/client";

// Русские названия этапов дела и их порядок
const STATUS_LABELS: Record<CaseStatus, string> = {
  DOCUMENTS: "Сбор документов",
  FILED:     "Заявление подано",
  COURT:     "Судебное заседание",
  HEARING:   "Слушание дела",
  DECISION:  "Решение суда",
  CLOSED:    "Дело закрыто",
};

const STATUS_ORDER: CaseStatus[] = [
  "DOCUMENTS", "FILED", "COURT", "HEARING", "DECISION", "CLOSED"
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Получаем дело клиента с обновлениями и документами
  const caseData = await db.case.findFirst({
    where: {
      clientId: session.user.id,
    },
    include: {
      // Только публичные обновления, свежие сверху
      updates:   { where: { isPublic: true }, orderBy: { createdAt: "desc" } },
      documents: { orderBy: { uploadedAt: "desc" } },
    },
  });

  const currentStep = caseData ? STATUS_ORDER.indexOf(caseData.status) : -1;

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
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>Личный кабинет</div>
          <div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>
            {session.user.name ?? session.user.email}
          </div>
        </div>

        {/* Выход */}
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}>
          <button className="btn btn-ghost" type="submit" style={{ fontSize: ".85rem" }}>
            Выйти
          </button>
        </form>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
        {!caseData ? (
          // Если дело ещё не создано администратором
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>⏳</div>
            <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>Дело оформляется</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Ваш юрист скоро создаст карточку дела. Обычно это занимает 1–2 рабочих дня.
            </p>
            <a href="tel:+79162979645" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
              Позвонить юристу
            </a>
          </div>
        ) : (
          <>
            {/* Статус дела */}
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>{caseData.title}</h2>

              {/* Прогресс-бар по этапам */}
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {STATUS_ORDER.map((status, i) => {
                  const isDone    = i < currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={status} style={{
                      flex: "1 1 80px",
                      padding: ".5rem .6rem",
                      borderRadius: 8,
                      textAlign: "center",
                      fontSize: ".75rem",
                      fontWeight: 600,
                      background: isDone    ? "#dcfce7"
                                : isCurrent ? "#dbeafe"
                                : "var(--bg)",
                      color: isDone    ? "#15803d"
                           : isCurrent ? "#1e40af"
                           : "var(--text-muted)",
                      border: isCurrent ? "1.5px solid #93c5fd" : "1.5px solid transparent",
                    }}>
                      {isCurrent && <div style={{ marginBottom: 2 }}>●</div>}
                      {STATUS_LABELS[status]}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Обновления от юриста */}
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Обновления по делу</h3>

              {caseData.updates.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
                  Обновлений пока нет
                </p>
              ) : (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".85rem" }}>
                  {caseData.updates.map((u) => (
                    <li key={u.id} style={{
                      paddingLeft: "1rem",
                      borderLeft: "3px solid var(--primary)",
                    }}>
                      <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginBottom: ".2rem" }}>
                        {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </div>
                      <div>{u.text}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Документы */}
            {caseData.documents.length > 0 && (
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Документы</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                  {caseData.documents.map((doc) => (
                    <li key={doc.id}>
                      <a href={doc.url} target="_blank" rel="noreferrer" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                        fontSize: ".9rem",
                      }}>
                        📄 {doc.name}
                      </a>
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
