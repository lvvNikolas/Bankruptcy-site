import { describe, it, expect } from "vitest";
import { escCsv, generatePassword, formatMoney, sanitizeFileName } from "./utils";

describe("escCsv", () => {
  it("возвращает строку без изменений если нет спецсимволов", () => {
    expect(escCsv("Иванов Иван")).toBe("Иванов Иван");
  });

  it("оборачивает в кавычки если есть запятая", () => {
    expect(escCsv("Иванов, Иван")).toBe('"Иванов, Иван"');
  });

  it("экранирует кавычки внутри строки", () => {
    expect(escCsv('Он сказал "привет"')).toBe('"Он сказал ""привет"""');
  });

  it("оборачивает если есть перенос строки", () => {
    expect(escCsv("Строка1\nСтрока2")).toBe('"Строка1\nСтрока2"');
  });

  it("возвращает пустую строку для null", () => {
    expect(escCsv(null)).toBe("");
  });

  it("возвращает пустую строку для undefined", () => {
    expect(escCsv(undefined)).toBe("");
  });
});

describe("generatePassword", () => {
  it("генерирует пароль нужной длины", () => {
    expect(generatePassword(10)).toHaveLength(10);
    expect(generatePassword(6)).toHaveLength(6);
  });

  it("пароль содержит только безопасные символы", () => {
    const pass = generatePassword(50);
    expect(pass).toMatch(/^[abcdefghjkmnpqrstuvwxyz23456789]+$/);
  });

  it("каждый вызов генерирует разный пароль", () => {
    const passes = new Set(Array.from({ length: 20 }, () => generatePassword(10)));
    expect(passes.size).toBeGreaterThan(1);
  });
});

describe("sanitizeFileName", () => {
  it("пропускает безопасные символы", () => {
    expect(sanitizeFileName("документ.pdf")).toBe("документ.pdf");
  });

  it("заменяет опасные символы на подчёркивание", () => {
    expect(sanitizeFileName("file<script>.pdf")).toBe("file_script_.pdf");
  });

  it("запрещает path traversal (..)", () => {
    const result = sanitizeFileName("../../etc/passwd");
    expect(result).not.toContain("..");
    expect(result).not.toContain("/");
    expect(result).toContain("etc");
  });

  it("обрезает длинное имя до 200 символов", () => {
    const long = "a".repeat(300);
    expect(sanitizeFileName(long)).toHaveLength(200);
  });
});

describe("formatMoney", () => {
  it("форматирует число в рубли", () => {
    expect(formatMoney(1500000)).toContain("1");
    expect(formatMoney(1500000)).toContain("500");
    expect(formatMoney(1500000)).toContain("₽");
  });

  it("ноль форматирует корректно", () => {
    expect(formatMoney(0)).toContain("₽");
  });
});
