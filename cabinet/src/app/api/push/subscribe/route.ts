import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!rateLimit(`push:sub:${getIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { endpoint, keys } = body ?? {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Неверные данные подписки" }, { status: 400 });
  }

  await db.pushSubscription.upsert({
    where:  { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth },
    create: { userId: session.user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint } = await req.json().catch(() => ({}));
  if (!endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });

  await db.pushSubscription.deleteMany({
    where: { endpoint, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
