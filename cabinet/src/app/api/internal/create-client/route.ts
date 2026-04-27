// Внутренний эндпоинт: создаёт клиента из основного сайта
// Защищён заголовком X-Internal-Secret (shared secret между двумя приложениями)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";
import { z } from "zod";
import { generatePassword } from "@/lib/utils";

const schema = z.object({
  name:  z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
});

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.CABINET_INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, phone } = parsed.data;

  // Если клиент уже есть — не создаём дубль
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ id: existing.id, isNew: false });
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, email, phone: phone ?? null, passwordHash, role: "CLIENT" },
  });

  const cabinetUrl = process.env.AUTH_URL ?? "https://cabinet.basolution.ru";
  try {
    await sendWelcomeEmail({ to: email, name, password, cabinetUrl });
  } catch (err) {
    console.error("Welcome email failed:", err);
  }

  return NextResponse.json({ id: user.id, isNew: true }, { status: 201 });
}
