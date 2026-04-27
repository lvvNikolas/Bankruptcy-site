// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require("nodemailer") as typeof import("nodemailer");

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendStatusChangeEmail(opts: {
  to: string; name: string | null; status: string; caseTitle: string; cabinetUrl: string;
}) {
  const name = opts.name ?? opts.to;
  await getTransporter().sendMail({
    from: `"Банкротство Солюшен" <${process.env.SMTP_FROM}>`,
    to: opts.to,
    subject: `Статус вашего дела изменён — ${opts.status}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <div style="background:#2563eb;width:32px;height:32px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px">
          <span style="color:#fff;font-size:12px;font-weight:700">БС</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:18px;color:#111827">Статус дела изменён</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Здравствуйте, ${name}.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:24px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Новый статус</div>
          <div style="font-size:16px;font-weight:600;color:#111827">${opts.status}</div>
          <div style="font-size:13px;color:#6b7280;margin-top:4px">${opts.caseTitle}</div>
        </div>
        <a href="${opts.cabinetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
          Открыть личный кабинет
        </a>
        <p style="margin-top:32px;font-size:12px;color:#9ca3af">Банкротство Солюшен · cabinet.basolution.ru</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(opts: {
  to: string; name: string | null; password: string; cabinetUrl: string;
}) {
  const name = opts.name ?? opts.to;
  await getTransporter().sendMail({
    from: `"Банкротство Солюшен" <${process.env.SMTP_FROM}>`,
    to: opts.to,
    subject: `Добро пожаловать в личный кабинет — Банкротство Солюшен`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <div style="background:#2563eb;width:32px;height:32px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px">
          <span style="color:#fff;font-size:12px;font-weight:700">БС</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:18px;color:#111827">Ваш личный кабинет готов</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Здравствуйте, ${name}. Мы создали для вас личный кабинет, где вы сможете следить за ходом вашего дела.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:24px">
          <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Данные для входа</div>
          <div style="margin-bottom:8px">
            <span style="font-size:12px;color:#9ca3af">Email</span><br/>
            <span style="font-size:14px;font-weight:600;color:#111827">${opts.to}</span>
          </div>
          <div>
            <span style="font-size:12px;color:#9ca3af">Пароль</span><br/>
            <span style="font-size:14px;font-weight:600;color:#111827;font-family:monospace">${opts.password}</span>
          </div>
        </div>
        <a href="${opts.cabinetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
          Войти в личный кабинет
        </a>
        <p style="margin-top:32px;font-size:12px;color:#9ca3af">Рекомендуем сменить пароль после первого входа.<br/>Банкротство Солюшен · cabinet.basolution.ru</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(opts: {
  to: string; name: string | null; resetUrl: string;
}) {
  const name = opts.name ?? opts.to;
  await getTransporter().sendMail({
    from: `"Банкротство Солюшен" <${process.env.SMTP_FROM}>`,
    to: opts.to,
    subject: `Сброс пароля — Банкротство Солюшен`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <div style="background:#2563eb;width:32px;height:32px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px">
          <span style="color:#fff;font-size:12px;font-weight:700">БС</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:18px;color:#111827">Сброс пароля</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Здравствуйте, ${name}. Вы запросили сброс пароля.</p>
        <a href="${opts.resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
          Задать новый пароль
        </a>
        <p style="margin-top:24px;font-size:13px;color:#6b7280">Ссылка действительна 1 час. Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.</p>
        <p style="margin-top:32px;font-size:12px;color:#9ca3af">Банкротство Солюшен · cabinet.basolution.ru</p>
      </div>
    `,
  });
}

export async function sendUpdateEmail(opts: {
  to: string; name: string | null; text: string; caseTitle: string; cabinetUrl: string;
}) {
  const name = opts.name ?? opts.to;
  await getTransporter().sendMail({
    from: `"Банкротство Солюшен" <${process.env.SMTP_FROM}>`,
    to: opts.to,
    subject: `Новое обновление по вашему делу`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <div style="background:#2563eb;width:32px;height:32px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px">
          <span style="color:#fff;font-size:12px;font-weight:700">БС</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:18px;color:#111827">Новое обновление от юриста</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Здравствуйте, ${name}.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:24px">
          <div style="font-size:14px;color:#374151;line-height:1.6">${opts.text}</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:8px">${opts.caseTitle}</div>
        </div>
        <a href="${opts.cabinetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
          Открыть личный кабинет
        </a>
        <p style="margin-top:32px;font-size:12px;color:#9ca3af">Банкротство Солюшен · cabinet.basolution.ru</p>
      </div>
    `,
  });
}
