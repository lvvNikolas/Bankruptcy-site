// API route: создание нового клиента администратором
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { logAction } from "@/lib/auditLog";

const schema = z.object({
  name:     z.string().trim().min(2, "Введите имя"),
  email:    z.string().email("Некорректный email"),
  phone:    z.string().trim().optional(),
  password: z.string().min(6, "Минимум 6 символов"),
});

export async function POST(req: NextRequest) {
  // Rate limit: 30 запросов в час с одного IP
  if (!rateLimit(`clients:${getIp(req)}`, 30, 60 * 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  // Только администратор может создавать клиентов
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Ошибка валидации";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { name, email, phone, password } = parsed.data;

  // Проверяем что email не занят
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Клиент с таким email уже существует" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      phone:        phone ?? null,
      passwordHash,
      role:         "CLIENT",
    },
  });

  const cabinetUrl = process.env.AUTH_URL ?? "https://cabinet.basolution.ru";
  try {
    await sendWelcomeEmail({ to: email, name, password, cabinetUrl });
  } catch (err) {
    console.error("Welcome email failed:", err);
  }

  await logAction({
    adminId:    session.user.id,
    adminEmail: session.user.email ?? "",
    action:     "CLIENT_CREATED",
    targetId:   user.id,
    meta:       { name, email },
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
