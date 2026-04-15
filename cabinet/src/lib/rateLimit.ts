// Простой in-memory rate limiter (сбрасывается при рестарте сервера)
// Для продакшна с несколькими инстансами — использовать Redis/Upstash

const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true; // разрешено
  }

  if (entry.count >= maxRequests) {
    return false; // заблокировано
  }

  entry.count++;
  return true;
}

// Получаем IP из заголовков (Vercel передаёт x-forwarded-for)
export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
