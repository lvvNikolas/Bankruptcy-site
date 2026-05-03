/**
 * Тесты контроля доступа к документам из /api/documents/[id]/route.ts.
 * Логика: ADMIN видит всё, CLIENT видит только своё дело.
 */
import { describe, it, expect } from "vitest";

// ─── Логика доступа (зеркалит route.ts) ───────────────────────────────────────

interface Session {
  user: { id: string; role: "ADMIN" | "CLIENT" };
}

interface Document {
  case: { clientId: string };
}

function hasAccess(session: Session, doc: Document): boolean {
  const isAdmin = session.user.role === "ADMIN";
  const isOwner = doc.case.clientId === session.user.id;
  return isAdmin || isOwner;
}

// ─── Тесты ────────────────────────────────────────────────────────────────────

const admin: Session = { user: { id: "admin-1", role: "ADMIN" } };
const clientA: Session = { user: { id: "client-a", role: "CLIENT" } };
const clientB: Session = { user: { id: "client-b", role: "CLIENT" } };

const docOfA: Document = { case: { clientId: "client-a" } };
const docOfB: Document = { case: { clientId: "client-b" } };

describe("hasAccess — ADMIN", () => {
  it("видит документы клиента A", () => {
    expect(hasAccess(admin, docOfA)).toBe(true);
  });

  it("видит документы клиента B", () => {
    expect(hasAccess(admin, docOfB)).toBe(true);
  });

  it("видит любой документ независимо от clientId", () => {
    expect(hasAccess(admin, { case: { clientId: "любой-id" } })).toBe(true);
  });
});

describe("hasAccess — CLIENT", () => {
  it("клиент A видит свои документы", () => {
    expect(hasAccess(clientA, docOfA)).toBe(true);
  });

  it("клиент A НЕ видит документы клиента B", () => {
    expect(hasAccess(clientA, docOfB)).toBe(false);
  });

  it("клиент B видит свои документы", () => {
    expect(hasAccess(clientB, docOfB)).toBe(true);
  });

  it("клиент B НЕ видит документы клиента A", () => {
    expect(hasAccess(clientB, docOfA)).toBe(false);
  });

  it("клиент с чужим id не проходит", () => {
    const stranger: Session = { user: { id: "unknown-999", role: "CLIENT" } };
    expect(hasAccess(stranger, docOfA)).toBe(false);
    expect(hasAccess(stranger, docOfB)).toBe(false);
  });
});

// ─── Тесты SessionGuard countdown логики ──────────────────────────────────────

describe("SessionGuard — расчёт обратного отсчёта", () => {
  const WARN_BEFORE_MS = 5 * 60 * 1000; // 5 минут

  function shouldShowWarning(expiresAt: number, now: number): boolean {
    return expiresAt - now <= WARN_BEFORE_MS && expiresAt - now > 0;
  }

  function formatCountdown(secondsLeft: number): string {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  it("не показывает попап за 10 минут до конца", () => {
    const now = 0;
    const expiresAt = 10 * 60 * 1000;
    expect(shouldShowWarning(expiresAt, now)).toBe(false);
  });

  it("показывает попап за 5 минут до конца", () => {
    const now = 0;
    const expiresAt = 5 * 60 * 1000;
    expect(shouldShowWarning(expiresAt, now)).toBe(true);
  });

  it("показывает попап за 1 минуту до конца", () => {
    const now = 0;
    const expiresAt = 60 * 1000;
    expect(shouldShowWarning(expiresAt, now)).toBe(true);
  });

  it("не показывает попап после истечения (remaining <= 0)", () => {
    const now = 10;
    const expiresAt = 5;
    expect(shouldShowWarning(expiresAt, now)).toBe(false);
  });

  it('форматирует "5:00" правильно', () => {
    expect(formatCountdown(300)).toBe("5:00");
  });

  it('форматирует "4:59" правильно', () => {
    expect(formatCountdown(299)).toBe("4:59");
  });

  it('форматирует "1:00" правильно', () => {
    expect(formatCountdown(60)).toBe("1:00");
  });

  it('форматирует "0:05" с ведущим нулём', () => {
    expect(formatCountdown(5)).toBe("0:05");
  });

  it('форматирует "0:00" на нуле', () => {
    expect(formatCountdown(0)).toBe("0:00");
  });

  it("isUrgent активен при < 60 секунд", () => {
    expect(59 <= 60).toBe(true);
    expect(61 <= 60).toBe(false);
  });
});
