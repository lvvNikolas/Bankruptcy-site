import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 попыток в 15 минут с одного IP
  if (!rateLimit(`pwd:${getIp(req)}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте через 15 минут" }, { status: 429 });
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
  }

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ error: "Новый пароль должен быть не менее 6 символов" }, { status: 400 });
  }

  if (newPassword.length > 128) {
    return NextResponse.json({ error: "Пароль слишком длинный" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  // Не раскрываем существует ли пользователь — всегда одно сообщение
  if (!user) {
    return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
