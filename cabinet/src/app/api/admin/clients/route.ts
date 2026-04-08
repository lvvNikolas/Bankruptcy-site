// API route: создание нового клиента администратором
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name:     z.string().trim().min(2, "Введите имя"),
  email:    z.string().email("Некорректный email"),
  phone:    z.string().trim().optional(),
  password: z.string().min(6, "Минимум 6 символов"),
});

export async function POST(req: NextRequest) {
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

  return NextResponse.json({ id: user.id }, { status: 201 });
}
