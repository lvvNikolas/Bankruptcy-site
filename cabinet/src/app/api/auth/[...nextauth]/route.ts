// NextAuth v5 route handler — обрабатывает все /api/auth/* запросы
import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

export const GET = handlers.GET;

// POST — оборачиваем для защиты от брутфорса на логин
export async function POST(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const { nextauth } = await ctx.params;

  // Ограничиваем только endpoint логина (callback/credentials)
  if (nextauth?.join("/") === "callback/credentials") {
    const ip = getIp(req);
    // 10 попыток за 15 минут с одного IP
    if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Слишком много попыток входа. Попробуйте через 15 минут" },
        { status: 429 }
      );
    }
  }

  return handlers.POST(req, ctx);
}
