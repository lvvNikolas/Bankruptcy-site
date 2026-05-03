import { describe, it, expect } from "vitest";
import { ACTION_LABELS, type AuditAction } from "./auditLog";

// Все ожидаемые действия — если добавить новое и забыть label,
// тест упадёт
const EXPECTED_ACTIONS: AuditAction[] = [
  "CLIENT_CREATED",
  "CLIENT_DELETED",
  "CLIENT_EDITED",
  "STATUS_CHANGED",
  "UPDATE_ADDED",
  "DOC_UPLOADED",
  "DOC_DELETED",
  "LOGIN",
];

describe("ACTION_LABELS", () => {
  it("содержит метку для каждого действия", () => {
    for (const action of EXPECTED_ACTIONS) {
      expect(ACTION_LABELS[action], `нет метки для ${action}`).toBeDefined();
      expect(ACTION_LABELS[action].length).toBeGreaterThan(0);
    }
  });

  it("LOGIN добавлен и имеет корректную метку", () => {
    expect(ACTION_LABELS.LOGIN).toBe("Вход в систему");
  });

  it("нет лишних действий сверх ожидаемых", () => {
    const keys = Object.keys(ACTION_LABELS) as AuditAction[];
    expect(keys.sort()).toEqual(EXPECTED_ACTIONS.sort());
  });

  it("все метки — непустые строки", () => {
    for (const [action, label] of Object.entries(ACTION_LABELS)) {
      expect(typeof label, `${action}: метка не строка`).toBe("string");
      expect(label.trim().length, `${action}: пустая метка`).toBeGreaterThan(0);
    }
  });
});
