import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/* ===== Валидация ===== */
const schema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().regex(/^\+7\d{10}$/),
  debt: z.string().trim().optional(),
  agree: z.boolean(),
  context: z.string().optional(),
  formId: z.string().optional(), // ✅
  page: z.string().optional(),   // ✅
  ts: z.number().optional(),
});

/* ===== ENV ===== */
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_TO = process.env.MAIL_TO;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO || !SMTP_PORT) {
  throw new Error("SMTP env variables are not set");
}

/* ===== SMTP Transport ===== */
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  requireTLS: true,
  tls: { servername: SMTP_HOST },
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function formatPhoneTel(phone: string) {
  // +7XXXXXXXXXX -> tel:+7...
  return `tel:${phone}`;
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const data = schema.parse(body);

    if (!data.agree) {
      return NextResponse.json({ error: "Нет согласия" }, { status: 400 });
    }

    const createdAt = new Date(data.ts || Date.now());
    const createdAtStr = createdAt.toLocaleString("ru-RU");

    const name = escapeHtml(data.name);
    const phone = escapeHtml(data.phone);
    const debt = escapeHtml(data.debt || "не указана");
    const context = escapeHtml(data.context || "—");
    const formId = escapeHtml(data.formId || "—");
    const page = escapeHtml(data.page || "—");

    const subject = `Новая заявка (${data.formId || "lead"})`;

    // ✅ Plain text (на всякий случай)
    const text = [
      "Новая заявка с сайта",
      "",
      `Имя: ${data.name}`,
      `Телефон: ${data.phone}`,
      `Сумма долга: ${data.debt || "не указана"}`,
      `Контекст: ${data.context || "—"}`,
      `Form ID: ${data.formId || "—"}`,
      `Страница: ${data.page || "—"}`,
      `Дата: ${createdAtStr}`,
    ].join("\n");

    // ✅ HTML письмо (красивое)
    const html = `
<div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; background:#f6f7fb; padding:24px;">
  <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,.08);">
    <div style="padding:20px 24px; background:linear-gradient(135deg,#111827,#1f2937); color:#fff;">
      <div style="font-size:14px; opacity:.85;">Банкротство • Заявки</div>
      <div style="font-size:22px; font-weight:700; margin-top:6px;">Новая заявка</div>
      <div style="font-size:13px; opacity:.8; margin-top:6px;">${escapeHtml(createdAtStr)}</div>
    </div>

    <div style="padding:22px 24px;">
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <div style="flex:1; min-width:260px; border:1px solid #eef0f6; border-radius:14px; padding:14px;">
          <div style="font-size:12px; color:#6b7280;">Имя</div>
          <div style="font-size:16px; font-weight:600; color:#111827; margin-top:4px;">${name}</div>
        </div>

        <div style="flex:1; min-width:260px; border:1px solid #eef0f6; border-radius:14px; padding:14px;">
          <div style="font-size:12px; color:#6b7280;">Телефон</div>
          <div style="font-size:16px; font-weight:700; color:#111827; margin-top:4px;">
            <a href="${formatPhoneTel(data.phone)}" style="color:#111827; text-decoration:none;">${phone}</a>
          </div>
        </div>
      </div>

      <div style="margin-top:12px; border:1px solid #eef0f6; border-radius:14px; padding:14px;">
        <div style="font-size:12px; color:#6b7280;">Сумма долга (≈)</div>
        <div style="font-size:16px; font-weight:600; color:#111827; margin-top:4px;">${debt}</div>
      </div>

      <div style="margin-top:12px; display:flex; gap:12px; flex-wrap:wrap;">
        <div style="flex:1; min-width:260px; border:1px solid #eef0f6; border-radius:14px; padding:14px;">
          <div style="font-size:12px; color:#6b7280;">Контекст</div>
          <div style="font-size:14px; color:#111827; margin-top:4px;">${context}</div>
        </div>

        <div style="flex:1; min-width:260px; border:1px solid #eef0f6; border-radius:14px; padding:14px;">
          <div style="font-size:12px; color:#6b7280;">Form ID</div>
          <div style="font-size:14px; color:#111827; margin-top:4px;">${formId}</div>
        </div>
      </div>

      <div style="margin-top:12px; border:1px solid #eef0f6; border-radius:14px; padding:14px;">
        <div style="font-size:12px; color:#6b7280;">Страница</div>
        <div style="font-size:13px; color:#111827; margin-top:4px; word-break:break-all;">
          ${page}
        </div>
      </div>

      <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
        <a href="${formatPhoneTel(data.phone)}"
           style="display:inline-block; padding:12px 16px; border-radius:12px; background:#111827; color:#fff; text-decoration:none; font-weight:600;">
          Перезвонить
        </a>
      </div>

      <div style="margin-top:18px; font-size:12px; color:#6b7280;">
        Это письмо отправлено автоматически с сайта.
      </div>
    </div>
  </div>
</div>
`;

    await transporter.sendMail({
      from: `"Заявки с сайта" <${SMTP_USER}>`,
      to: MAIL_TO,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Некорректные данные формы" },
        { status: 400 }
      );
    }

    console.error("MAIL ERROR FULL:", e);

    return NextResponse.json(
      { error: "Ошибка отправки письма" },
      { status: 500 }
    );
  }
}