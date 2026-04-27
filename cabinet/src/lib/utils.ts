/** Экранирует значение для CSV — оборачивает в кавычки если есть запятые/кавычки/переносы */
export function escCsv(v: string | null | undefined): string {
  const s = v ?? "";
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Генерирует случайный пароль из безопасных символов (без похожих: 0/O, 1/l/I) */
export function generatePassword(len = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let p = "";
  for (let i = 0; i < len; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

/** Форматирует число в рубли */
export function formatMoney(n: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Санитизирует имя файла — убирает небезопасные символы */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Zа-яА-ЯёЁ0-9._\- ]/g, "_")
    .replace(/\.{2,}/g, "_")
    .slice(0, 200);
}
