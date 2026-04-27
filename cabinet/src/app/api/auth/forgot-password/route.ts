import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 запросов в час с одного IP
  if (!rateLimit(`forgot:${getIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({})) as { email?: unknown };
  const raw = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
  if (!raw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return NextResponse.json({ ok: true }); // не раскрываем ошибку валидации
  }

  const user = await db.user.findUnique({ where: { email: raw } });

  // Всегда возвращаем 200, чтобы не раскрывать существование email
  if (!user) return NextResponse.json({ ok: true }); // не раскрываем наличие email

  // Инвалидируем старые токены
  await db.passwordResetToken.updateMany({ where: { userId: user.id, used: false }, data: { used: true } });

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 час

  const resetToken = await db.passwordResetToken.create({
    data: { userId: user.id, expiresAt },
  });

  const baseUrl = process.env.AUTH_URL ?? "https://cabinet.basolution.ru";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken.token}`;

  try {
    await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
  } catch (err) {
    console.error("Password reset email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
