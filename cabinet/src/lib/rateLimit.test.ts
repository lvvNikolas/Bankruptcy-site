import { describe, it, expect, beforeEach, vi } from "vitest";

// Изолируем модуль чтобы сбрасывать store между тестами
let rateLimit: (key: string, max: number, windowMs: number) => boolean;
let getIp: (req: Request) => string;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("./rateLimit");
  rateLimit = mod.rateLimit;
  getIp = mod.getIp;
});

describe("rateLimit", () => {
  it("разрешает первый запрос", () => {
    expect(rateLimit("test:1", 3, 60_000)).toBe(true);
  });

  it("разрешает запросы до лимита", () => {
    rateLimit("test:2", 3, 60_000);
    rateLimit("test:2", 3, 60_000);
    expect(rateLimit("test:2", 3, 60_000)).toBe(true);
  });

  it("блокирует запросы после превышения лимита", () => {
    rateLimit("test:3", 2, 60_000);
    rateLimit("test:3", 2, 60_000);
    expect(rateLimit("test:3", 2, 60_000)).toBe(false);
  });

  it("разные ключи не влияют друг на друга", () => {
    rateLimit("a", 1, 60_000);
    rateLimit("a", 1, 60_000); // заблокирован
    expect(rateLimit("b", 1, 60_000)).toBe(true); // другой ключ — ок
  });

  it("окно сбрасывается после истечения", async () => {
    rateLimit("test:4", 1, 50);
    rateLimit("test:4", 1, 50); // заблокирован
    await new Promise(r => setTimeout(r, 60));
    expect(rateLimit("test:4", 1, 50)).toBe(true); // окно истекло
  });
});

describe("getIp", () => {
  it("берёт первый IP из x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getIp(req)).toBe("1.2.3.4");
  });

  it("использует x-real-ip если нет x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(getIp(req)).toBe("9.9.9.9");
  });

  it("возвращает unknown если нет заголовков", () => {
    const req = new Request("http://localhost");
    expect(getIp(req)).toBe("unknown");
  });
});
