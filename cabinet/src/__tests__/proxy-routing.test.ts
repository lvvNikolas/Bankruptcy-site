/**
 * Тесты логики маршрутизации из proxy.ts.
 * Тестируем правила как чистые функции — без Next.js middleware и NextAuth.
 */
import { describe, it, expect } from "vitest";

// ─── Правила из proxy.ts ───────────────────────────────────────────────────────

function isPublicPage(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

type Role = "ADMIN" | "CLIENT";

interface MockSession {
  user: { role: Role };
}

/**
 * Возвращает куда перенаправить пользователя, или null если всё ок.
 */
function getRedirect(
  pathname: string,
  session: MockSession | null,
): string | null {
  const isLoggedIn = !!session;
  const role = session?.user.role;

  if (isLoggedIn && pathname === "/login") {
    return role === "ADMIN" ? "/admin" : "/dashboard";
  }
  if (!isLoggedIn && !isPublicPage(pathname)) {
    return "/login";
  }
  if (isLoggedIn && pathname.startsWith("/admin") && role !== "ADMIN") {
    return "/dashboard";
  }
  return null;
}

// ─── Тесты isPublicPage ────────────────────────────────────────────────────────

describe("isPublicPage", () => {
  it("login — публичная", () => {
    expect(isPublicPage("/login")).toBe(true);
  });

  it("forgot-password — публичная (исправление бага)", () => {
    expect(isPublicPage("/forgot-password")).toBe(true);
  });

  it("reset-password с токеном — публичная", () => {
    expect(isPublicPage("/reset-password?token=abc123")).toBe(true);
  });

  it("dashboard — приватная", () => {
    expect(isPublicPage("/dashboard")).toBe(false);
  });

  it("admin — приватная", () => {
    expect(isPublicPage("/admin")).toBe(false);
  });

  it("api/admin/export — приватная", () => {
    expect(isPublicPage("/api/admin/export")).toBe(false);
  });

  it("корень — приватный", () => {
    expect(isPublicPage("/")).toBe(false);
  });
});

// ─── Тесты правил редиректа ────────────────────────────────────────────────────

describe("getRedirect — неавторизованный пользователь", () => {
  it("на /dashboard → /login", () => {
    expect(getRedirect("/dashboard", null)).toBe("/login");
  });

  it("на /admin → /login", () => {
    expect(getRedirect("/admin", null)).toBe("/login");
  });

  it("на /login → без редиректа", () => {
    expect(getRedirect("/login", null)).toBeNull();
  });

  it("на /forgot-password → без редиректа (публичная страница)", () => {
    expect(getRedirect("/forgot-password", null)).toBeNull();
  });

  it("на /reset-password?token=x → без редиректа", () => {
    expect(getRedirect("/reset-password?token=x", null)).toBeNull();
  });

  it("на /api/admin/clients → /login", () => {
    expect(getRedirect("/api/admin/clients", null)).toBe("/login");
  });
});

describe("getRedirect — CLIENT", () => {
  const client: MockSession = { user: { role: "CLIENT" } };

  it("на /login → /dashboard", () => {
    expect(getRedirect("/login", client)).toBe("/dashboard");
  });

  it("на /dashboard → без редиректа", () => {
    expect(getRedirect("/dashboard", client)).toBeNull();
  });

  it("на /admin → /dashboard (нет прав)", () => {
    expect(getRedirect("/admin", client)).toBe("/dashboard");
  });

  it("на /admin/clients/123 → /dashboard", () => {
    expect(getRedirect("/admin/clients/123", client)).toBe("/dashboard");
  });

  it("на /forgot-password → без редиректа", () => {
    expect(getRedirect("/forgot-password", client)).toBeNull();
  });
});

describe("getRedirect — ADMIN", () => {
  const admin: MockSession = { user: { role: "ADMIN" } };

  it("на /login → /admin", () => {
    expect(getRedirect("/login", admin)).toBe("/admin");
  });

  it("на /admin → без редиректа", () => {
    expect(getRedirect("/admin", admin)).toBeNull();
  });

  it("на /admin/clients/123 → без редиректа", () => {
    expect(getRedirect("/admin/clients/123", admin)).toBeNull();
  });

  it("на /dashboard → без редиректа (admin может заходить)", () => {
    expect(getRedirect("/dashboard", admin)).toBeNull();
  });
});
