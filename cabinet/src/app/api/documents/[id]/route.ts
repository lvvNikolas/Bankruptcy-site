// Приватный прокси для документов — проверяет сессию перед отдачей файла.
// Заменяет прямые публичные ссылки на Vercel Blob.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const doc = await db.document.findUnique({
    where: { id },
    include: { case: { select: { clientId: true } } },
  });

  if (!doc) {
    return NextResponse.json({ error: "Документ не найден" }, { status: 404 });
  }

  // Доступ: администратор или владелец дела
  const isAdmin = session.user.role === "ADMIN";
  const isOwner = doc.case.clientId === session.user.id;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  // Забираем файл с сервера (токен нужен для private blobs)
  const blobRes = await fetch(doc.url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });

  if (!blobRes.ok) {
    return NextResponse.json({ error: "Файл недоступен" }, { status: 502 });
  }

  const contentType = blobRes.headers.get("Content-Type") ?? "application/octet-stream";

  return new NextResponse(blobRes.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
      // Приватное кэширование — браузер кэширует, но не CDN
      "Cache-Control": "private, max-age=300",
    },
  });
}
