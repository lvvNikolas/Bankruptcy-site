/**
 * Общие утилиты для работы с формами заявок.
 * Использутся в LeadForm и (опционально) в серверных обработчиках.
 */

// ─── Типы ─────────────────────────────────────────────────────────────────────

/** Тип JSON-ответа API формы */
export type ApiJson = Record<string, unknown> & {
  ok?: boolean;
  error?: string;
  /** Кусок сырого ответа на случай не-JSON-ответа сервера (HTML, текст) */
  _raw?: string;
};

// ─── Утилиты ──────────────────────────────────────────────────────────────────

/**
 * Нормализует строку с телефоном к формату +7XXXXXXXXXX.
 *
 * Принимает любой распространённый формат ввода:
 *   89161234567  →  +79161234567
 *   +79161234567 →  +79161234567
 *    79161234567 →  +79161234567
 *    9161234567  →  +79161234567
 */
export function normalizePhone(raw: string): string {
  if (!raw) return raw;

  const digits = raw.replace(/\D/g, "");

  // 7XXXXXXXXXX или +7XXXXXXXXXX
  if (digits.startsWith("7")) return "+7" + digits.slice(1, 11);

  // 8XXXXXXXXXX → +7XXXXXXXXXX
  if (digits.startsWith("8")) return "+7" + digits.slice(1, 11);

  // иначе берём первые 10 цифр и добавляем +7
  return "+7" + digits.slice(0, 10);
}

/**
 * Извлекает читаемое сообщение об ошибке из неизвестного значения.
 * Fallback: универсальный текст для пользователя.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Ошибка отправки. Попробуйте ещё раз.";
}

/**
 * Читает тело Response и безопасно парсит JSON.
 * При получении HTML/текста возвращает объект с полем `_raw` для диагностики.
 */
export async function safeJson(res: Response): Promise<ApiJson> {
  const text = await res.text().catch(() => "");
  if (!text) return {};

  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed as ApiJson;
    return {};
  } catch {
    // Сервер вернул HTML или другой не-JSON — сохраняем кусок для отладки
    return { _raw: text.slice(0, 2_000) };
  }
}

/**
 * Извлекает поле `error` из JSON-ответа API.
 * Возвращает null, если поле отсутствует или пустое.
 */
export function getApiErrorMessage(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const rec = json as Record<string, unknown>;
  const msg = rec.error;
  return typeof msg === "string" && msg.trim() ? msg : null;
}
