"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function SearchBar({ defaultQ = "", defaultStatus = "" }: { defaultQ?: string; defaultStatus?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div style={{ display: "flex", gap: ".5rem", marginBottom: ".875rem" }}>
      <input
        className="input"
        placeholder="Поиск по имени или email…"
        defaultValue={defaultQ}
        style={{ maxWidth: 280 }}
        onChange={e => update("q", e.target.value)}
      />
      <select
        className="input"
        defaultValue={defaultStatus}
        style={{ maxWidth: 180 }}
        onChange={e => update("status", e.target.value)}
      >
        <option value="">Все статусы</option>
        <option value="DOCUMENTS">Документы</option>
        <option value="FILED">Подано</option>
        <option value="COURT">Суд назначен</option>
        <option value="HEARING">Слушание</option>
        <option value="DECISION">Решение</option>
        <option value="CLOSED">Закрыто</option>
      </select>
    </div>
  );
}
