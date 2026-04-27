import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { escCsv } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  DOCUMENTS: "Сбор документов",
  FILED:     "Подано",
  COURT:     "Суд назначен",
  HEARING:   "Слушание",
  DECISION:  "Решение",
  CLOSED:    "Закрыто",
};

export async function GET() {
  try {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const clients = await db.user.findMany({
    where: { role: "CLIENT" },
    include: { cases: { orderBy: { startedAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const rows: string[] = [
    ["Имя", "Email", "Телефон", "Дело", "Долг (руб.)", "Статус", "Дата регистрации"].join(","),
  ];

  for (const c of clients) {
    const cs = c.cases[0];
    rows.push([
      escCsv(c.name),
      escCsv(c.email),
      escCsv(c.phone),
      escCsv(cs?.title),
      cs?.debtAmount != null ? String(Math.round(cs.debtAmount)) : "",
      escCsv(cs ? STATUS_LABELS[cs.status] : ""),
      escCsv(new Date(c.createdAt).toLocaleDateString("ru-RU")),
    ].join(","));
  }

  const csv = "\uFEFF" + rows.join("\r\n"); // BOM — Excel открывает кириллицу правильно

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clients-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
  } catch (err) {
    console.error("[export] failed:", err);
    return NextResponse.json({ error: "Ошибка экспорта" }, { status: 500 });
  }
}
