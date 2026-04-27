import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { put, del } from "@vercel/blob";
import { rateLimit, getIp } from "@/lib/rateLimit";

// Разрешённые MIME-типы документов
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

import { sanitizeFileName } from "@/lib/utils";

export async function POST(req: NextRequest) {
  // Rate limit: 20 загрузок в минуту с одного IP
  if (!rateLimit(`docs:upload:${getIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const formData = await req.formData();
  const caseId = formData.get("caseId") as string | null;
  const file = formData.get("file") as File | null;

  if (!caseId || !file) {
    return NextResponse.json({ error: "caseId и файл обязательны" }, { status: 400 });
  }

  // Проверяем что дело существует в БД
  const caseExists = await db.case.findUnique({ where: { id: caseId }, select: { id: true } });
  if (!caseExists) {
    return NextResponse.json({ error: "Дело не найдено" }, { status: 404 });
  }

  // Проверяем тип файла
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Недопустимый тип файла. Разрешены: PDF, JPG, PNG, DOCX, XLSX" },
      { status: 400 }
    );
  }

  // Проверяем размер файла
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Файл слишком большой. Максимум 10 МБ" },
      { status: 400 }
    );
  }

  const safeName = sanitizeFileName(file.name);

  const blob = await put(`cases/${caseId}/${Date.now()}-${safeName}`, file, {
    access: "public",
    contentType: file.type,
  });

  const doc = await db.document.create({
    data: {
      caseId,
      name: safeName,
      url: blob.url,
    },
  });

  return NextResponse.json({ id: doc.id, name: doc.name, url: doc.url });
}

export async function DELETE(req: NextRequest) {
  if (!rateLimit(`docs:delete:${getIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { docId } = await req.json() as { docId?: string };
  if (!docId) return NextResponse.json({ error: "docId обязателен" }, { status: 400 });

  const doc = await db.document.findUnique({ where: { id: docId } });
  if (!doc) return NextResponse.json({ error: "Документ не найден" }, { status: 404 });

  try {
    await del(doc.url);
  } catch (err) {
    console.error("Blob delete failed:", err);
    // продолжаем — удаляем запись из БД даже если Blob недоступен
  }

  await db.document.delete({ where: { id: docId } });

  return NextResponse.json({ ok: true });
}
