// Простой in-memory rate limiter (сбрасывается при рестарте сервера)
// Для продакшна с несколькими инстансами — использовать Redis/Upstash

const store = new Map<string, { count: number; resetAt: number }>();

// Очищаем просроченные записи каждые 10 минут чтобы не росла память
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 10 * 60_000;

function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  maybeCleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true; // разрешено
  }

  if (entry.count >= maxRequests) return false; // заблокировано

  entry.count++;
  return true;
}

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
