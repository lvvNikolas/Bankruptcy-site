import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ExtraData = Record<string, unknown>;
type QuizRow = [string, string];

const schema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().regex(/^\+7\d{10}$/),
  debt: z.string().trim().optional(),
  agree: z.boolean(),
  context: z.string().optional(),
  ts: z.number().optional(),
  formId: z.string().optional(),
  timeOnPageMs: z.number().optional(),
  extraData: z.record(z.string(), z.unknown()).optional().nullable(),
});

/* ========= helpers ========= */
function safeString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fmtMoneyLike(s?: string): string {
  if (!s) return "не указана";
  const cleaned = s.replace(/[^\d]/g, "");
  if (!cleaned) return s;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return s;
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

function fmtMs(ms?: number): string {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} сек`;
}

function contextMeta(ctx?: string): { title: string; badge: string } {
  const c = (ctx || "").toLowerCase();
  if (c === "quiz") return { title: "Заявка с квиза", badge: "QUIZ" };
  if (c === "cases") return { title: "Заявка из кейсов", badge: "CASES" };
  if (c === "contacts")
    return { title: "Заявка со страницы контактов", badge: "CONTACTS" };
  if (c === "hero") return { title: "Заявка из первого экрана", badge: "HERO" };
  return { title: "Заявка с сайта", badge: "SITE" };
}

function pickQuiz(extraData?: ExtraData | null): {
  summary: QuizRow[];
  answers: Record<string, unknown>;
  other: ExtraData;
} {
  const extra: ExtraData = extraData ?? {};

  const rawSummary = Array.isArray(extra.quizSummary)
    ? (extra.quizSummary as unknown[])
    : [];
  const summary: QuizRow[] = [];

  for (const row of rawSummary) {
    if (Array.isArray(row) && row.length === 2) {
      const q = safeString(row[0]).trim();
      const a = safeString(row[1]).trim();
      if (q && a) summary.push([q, a]);
    }
  }

  const answers =
    extra.quizAnswers && typeof extra.quizAnswers === "object"
      ? (extra.quizAnswers as Record<string, unknown>)
      : {};

  const { quizSummary: _qs, quizAnswers: _qa, ...other } = extra;
  return { summary, answers, other };
}

function buildTextMail(data: z.infer<typeof schema>): string {
  const dateStr = new Date().toLocaleString("ru-RU");
  const debt = fmtMoneyLike(data.debt);
  const timeOnPage = fmtMs(data.timeOnPageMs);

  const { summary, answers } = pickQuiz((data.extraData as ExtraData) ?? null);

  const lines: string[] = [];
  lines.push("Новая заявка");
  lines.push("");
  lines.push(`Имя: ${data.name}`);
  lines.push(`Телефон: ${data.phone}`);
  lines.push(`Сумма долга: ${debt}`);
  lines.push(`Контекст: ${data.context || "—"}`);
  lines.push(`Form ID: ${data.formId || "—"}`);
  lines.push(`Time on page: ${timeOnPage}`);
  lines.push(`Дата: ${dateStr}`);

  if (summary.length) {
    lines.push("");
    lines.push("Квиз — ответы");
    lines.push("--------------------------------");
    for (const [q, a] of summary) lines.push(`• ${q}: ${a}`);
  }

  if (Object.keys(answers).length) {
    lines.push("");
    lines.push("Квиз — raw answers (id)");
    lines.push("--------------------------------");
    for (const [k, v] of Object.entries(answers)) {
      lines.push(
        `• ${k}: ${
          Array.isArray(v) ? v.map(safeString).join(", ") : safeString(v)
        }`
      );
    }
  }

  return lines.join("\n");
}

function buildHtmlMail(data: z.infer<typeof schema>): string {
  const dateStr = escapeHtml(new Date().toLocaleString("ru-RU"));
  const debt = escapeHtml(fmtMoneyLike(data.debt));
  const timeOnPage = escapeHtml(fmtMs(data.timeOnPageMs));
  const ctx = contextMeta(data.context);

  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const context = escapeHtml(data.context || "—");
  const formId = escapeHtml(data.formId || "—");

  const { summary, answers, other } = pickQuiz((data.extraData as ExtraData) ?? null);

  const summaryRows = summary
    .map(
      ([q, a]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #edf0f5;color:#111827;font-weight:600;vertical-align:top;">${escapeHtml(
            q
          )}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #edf0f5;color:#111827;vertical-align:top;">${escapeHtml(
            a
          )}</td>
        </tr>`
    )
    .join("");

  const answersRows = Object.entries(answers)
    .map(([k, v]) => {
      const val = Array.isArray(v) ? v.map(safeString).join(", ") : safeString(v);
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #edf0f5;color:#374151;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${escapeHtml(
            k
          )}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #edf0f5;color:#111827;">${escapeHtml(
            val
          )}</td>
        </tr>`;
    })
    .join("");

  const otherBlock =
    Object.keys(other).length > 0
      ? `<div style="margin-top:18px;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">Доп. данные (extraData)</div>
          <pre style="white-space:pre-wrap;background:#0b1020;color:#e5e7eb;padding:12px;border-radius:12px;font-size:12px;line-height:1.45;overflow:auto;">${escapeHtml(
            JSON.stringify(other, null, 2)
          )}</pre>
        </div>`
      : "";

  const quizSection =
    summary.length || Object.keys(answers).length
      ? `<div style="margin-top:18px;">
          <h3 style="margin:0 0 10px;font-size:16px;color:#111827;">Квиз</h3>

          ${
            summary.length
              ? `<div style="background:#ffffff;border:1px solid #edf0f5;border-radius:16px;overflow:hidden;">
                  <div style="padding:12px 14px;background:#f8fafc;border-bottom:1px solid #edf0f5;font-weight:700;color:#111827;">
                    Ответы 
                  </div>
                  <table style="width:100%;border-collapse:collapse;">
                    <tbody>
                      ${summaryRows}
                    </tbody>
                  </table>
                </div>`
              : ""
          }

          ${
            Object.keys(answers).length
              ? `<div style="margin-top:12px;background:#ffffff;border:1px solid #edf0f5;border-radius:16px;overflow:hidden;">
                  <div style="padding:12px 14px;background:#f8fafc;border-bottom:1px solid #edf0f5;font-weight:700;color:#111827;">
                    Raw answers (id)
                  </div>
                  <table style="width:100%;border-collapse:collapse;">
                    <tbody>
                      ${answersRows}
                    </tbody>
                  </table>
                </div>`
              : ""
          }

          ${otherBlock}
        </div>`
      : "";

  return `
  <div style="margin:0;padding:0;background:#f3f4f6;">
    <div style="max-width:720px;margin:0 auto;padding:22px 14px;font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Noto Sans', 'Apple Color Emoji','Segoe UI Emoji';">
      
      <div style="background:#111827;color:#fff;border-radius:18px;padding:18px 18px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:12px;opacity:.85;margin-bottom:6px;">${escapeHtml(
            ctx.title
          )}</div>
          <div style="font-size:18px;font-weight:800;line-height:1.2;">${name} • ${phone}</div>
        </div>
        <div style="background:#f59e0b;color:#111827;font-weight:900;font-size:12px;padding:8px 10px;border-radius:999px;">
          ${escapeHtml(ctx.badge)}
        </div>
      </div>

      <div style="margin-top:14px;background:#fff;border:1px solid #edf0f5;border-radius:18px;padding:16px 16px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#111827;">Детали заявки</h2>

        <table style="width:100%;border-collapse:separate;border-spacing:0 8px;">
          <tbody>
            <tr>
              <td style="width:160px;color:#6b7280;font-size:12px;">Имя</td>
              <td style="color:#111827;font-weight:700;">${name}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;">Телефон</td>
              <td style="color:#111827;font-weight:700;">${phone}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;">Сумма долга</td>
              <td style="color:#111827;font-weight:700;">${debt}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;">Контекст</td>
              <td style="color:#111827;">${context}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;">Form ID</td>
              <td style="color:#111827;">${formId}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;">Time on page</td>
              <td style="color:#111827;">${timeOnPage}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;">Дата</td>
              <td style="color:#111827;">${dateStr}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:12px;">
          <a href="tel:${escapeHtml(data.phone)}"
             style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:12px;font-weight:800;">
             Позвонить клиенту
          </a>
        </div>

        ${quizSection}
      </div>

      <div style="margin-top:10px;color:#9ca3af;font-size:12px;text-align:center;">
        Авто-письмо с сайта • ${dateStr}
      </div>
    </div>
  </div>
  `;
}

/* ===== CORS / methods ===== */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed. Use POST." },
    { status: 405, headers: { ...corsHeaders, Allow: "POST, OPTIONS" } }
  );
}

/* ===== main ===== */
export async function POST(req: Request) {
  try {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const MAIL_TO = process.env.MAIL_TO;

    const miss: string[] = [];
    if (!SMTP_HOST) miss.push("SMTP_HOST");
    if (!SMTP_USER) miss.push("SMTP_USER");
    if (!SMTP_PASS) miss.push("SMTP_PASS");
    if (!MAIL_TO) miss.push("MAIL_TO");

    if (miss.length) {
      return NextResponse.json(
        { error: `Не заданы переменные окружения: ${miss.join(", ")}` },
        { status: 500, headers: corsHeaders }
      );
    }

    const body: unknown = await req.json();
    const data = schema.parse(body);

    if (!data.agree) {
      return NextResponse.json({ error: "Нет согласия" }, { status: 400, headers: corsHeaders });
    }

    // ✅ ВАЖНО: 587 = STARTTLS => secure: false
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST!,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: SMTP_USER!, pass: SMTP_PASS! },
      requireTLS: SMTP_PORT === 587,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });

    // Быстрая проверка соединения (очень помогает в Vercel Logs)
    await transporter.verify();

    const meta = contextMeta(data.context);
    const subject = `${meta.title}: ${data.name} ${data.phone}`;

    const text = buildTextMail(data);
    const html = buildHtmlMail(data);

    await transporter.sendMail({
      from: `"Заявки с сайта" <${SMTP_USER}>`,
      to: MAIL_TO,
      subject,
      text,
      html,
      replyTo: SMTP_USER,
    });

    return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Некорректные данные формы" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Важно: это будет видно в Vercel logs
    if (e instanceof Error) {
      console.error("MAIL ERROR:", e.message);
      console.error("MAIL ERROR FULL:", e);
      return NextResponse.json(
        { error: `Ошибка отправки письма: ${e.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    console.error("MAIL ERROR:", e);
    return NextResponse.json(
      { error: "Ошибка отправки письма" },
      { status: 500, headers: corsHeaders }
    );
  }
}