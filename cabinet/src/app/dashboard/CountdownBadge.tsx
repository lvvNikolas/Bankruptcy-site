"use client";
import { useEffect, useState } from "react";

function pluralDays(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "день";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "дня";
  return "дней";
}

function getCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "уже состоялось";
  const days  = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins  = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 1) return `через ${days} ${pluralDays(days)}`;
  if (days === 1) return "завтра";
  if (hours > 0) return `через ${hours} ч ${mins} мин`;
  return `через ${mins} мин`;
}

export function CountdownBadge({ eventAt, label }: { eventAt: string; label: string }) {
  const date = new Date(eventAt);
  const [text, setText] = useState(() => getCountdown(date));

  useEffect(() => {
    const id = setInterval(() => setText(getCountdown(date)), 60_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventAt]);

  const dateStr = date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,.08)" }}>
      <div style={{ fontSize: ".6875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".375rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>
        {dateStr}
      </div>
      <div style={{ fontSize: ".8125rem", color: "#9ca3af", marginTop: ".125rem" }}>
        {text}
      </div>
    </div>
  );
}
