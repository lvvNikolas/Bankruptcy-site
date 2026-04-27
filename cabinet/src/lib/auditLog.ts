import { db } from "./db";

export type AuditAction =
  | "CLIENT_CREATED"
  | "CLIENT_DELETED"
  | "CLIENT_EDITED"
  | "STATUS_CHANGED"
  | "UPDATE_ADDED"
  | "DOC_UPLOADED"
  | "DOC_DELETED";

export const ACTION_LABELS: Record<AuditAction, string> = {
  CLIENT_CREATED: "Клиент создан",
  CLIENT_DELETED: "Клиент удалён",
  CLIENT_EDITED:  "Данные клиента изменены",
  STATUS_CHANGED: "Статус дела изменён",
  UPDATE_ADDED:   "Обновление добавлено",
  DOC_UPLOADED:   "Документ загружен",
  DOC_DELETED:    "Документ удалён",
};

export async function logAction(opts: {
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  targetId?: string;
  meta?: Record<string, unknown>;
}) {
  try {
    await db.auditLog.create({
      data: {
        adminId:    opts.adminId,
        adminEmail: opts.adminEmail,
        action:     opts.action,
        targetId:   opts.targetId ?? null,
        meta:       opts.meta ? JSON.stringify(opts.meta) : null,
      },
    });
  } catch (err) {
    console.error("AuditLog failed:", err);
  }
}
