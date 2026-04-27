import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!rateLimit(`reset:${getIp(req)}`, 10, 60 * 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  const { token, password } = await req.json() as { token?: string; password?: string };

  if (!token || !password) {
    return NextResponse.json({ error: "Токен и пароль обязательны" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Минимум 6 символов" }, { status: 400 });
  }

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Ссылка недействительна или устарела" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
