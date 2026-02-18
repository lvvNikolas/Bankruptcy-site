"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "@styles/LeadForm.css";

/* =========================
   VALIDATION
========================= */

const schema = z.object({
  name: z.string().trim().min(2, "Введите имя"),
  phone: z.string().trim().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  debt: z.string().trim().optional(),
  agree: z.boolean().refine((v) => v === true, { message: "Обязательное согласие" }),
});

type FormData = z.infer<typeof schema>;

/* =========================
   TYPES
========================= */

type Props = {
  context?: string;   // откуда форма
  formId?: string;    // id формы
  onSuccess?: () => void;

  /**
   * Куда отправляем:
   * - для статического сайта на хостинге: "/lead.php"
   * - если снова будет Next API route: "/api/lead"
   */
  actionUrl?: string;
};

type ApiJson = Record<string, unknown> & {
  ok?: boolean;
  error?: string;
  _raw?: string;
};

/* =========================
   HELPERS
========================= */

function normalizePhone(raw: string): string {
  if (!raw) return raw;

  const digits = raw.replace(/\D/g, "");

  // 7XXXXXXXXXX
  if (digits.startsWith("7")) return "+7" + digits.slice(1, 11);

  // 8XXXXXXXXXX -> +7XXXXXXXXXX
  if (digits.startsWith("8")) return "+7" + digits.slice(1, 11);

  // если ввели +7..., уже норм
  if (raw.trim().startsWith("+7")) return "+7" + digits.slice(1, 11);

  // иначе просто берём первые 10 цифр после +7
  return "+7" + digits.slice(0, 10);
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Ошибка отправки. Попробуйте ещё раз.";
}

function getApiErrorMessage(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const rec = json as Record<string, unknown>;
  const msg = rec.error;
  return typeof msg === "string" && msg.trim() ? msg : null;
}

async function safeJson(res: Response): Promise<ApiJson> {
  const text = await res.text().catch(() => "");
  if (!text) return {};

  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed as ApiJson;
    return {};
  } catch {
    // сервер мог вернуть HTML/текст — сохраним кусок для диагностики
    return { _raw: text.slice(0, 2000) };
  }
}

/* =========================
   COMPONENT
========================= */

export default function LeadForm({
  context = "landing",
  formId = "lead_default",
  onSuccess,
  actionUrl = "/lead.php", // ✅ по умолчанию под статический сайт
}: Props) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const honeypotValue = useRef("");
  const mountedAt = useMemo(() => Date.now(), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", debt: "", agree: false },
  });

  const phone = watch("phone");

  // Автоформат телефона под +7XXXXXXXXXX
  useEffect(() => {
    if (!phone) return;
    const normalized = normalizePhone(phone);
    if (normalized !== phone) setValue("phone", normalized, { shouldValidate: false });
  }, [phone, setValue]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    // антибот: если заполнили скрытое поле — "успешно" и молча
    if (honeypotValue.current) {
      reset();
      setDone(true);
      onSuccess?.();
      return;
    }

    const page = typeof window !== "undefined" ? window.location.href : "";
    const timeOnPageMs = Date.now() - mountedAt;

    // payload — одинаковый для php или api
    const payload: Record<string, unknown> = {
      ...data,
      context,
      formId,
      page,
      ts: Date.now(),
      timeOnPageMs,
      // honeypot отправим тоже (пустой), чтобы php мог фильтровать
      company: honeypotValue.current,
    };

    try {
      const res = await fetch(actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await safeJson(res);

      if (!res.ok) {
        const apiMsg = getApiErrorMessage(json);
        const raw = typeof json._raw === "string" ? `\n${json._raw}` : "";
        throw new Error(apiMsg || `Ошибка отправки (HTTP ${res.status}).${raw}`);
      }

      // если сервер вернул ok=false
      if (json && json.ok === false) {
        const apiMsg = getApiErrorMessage(json);
        throw new Error(apiMsg || "Ошибка отправки. Попробуйте ещё раз.");
      }

      reset();
      setDone(true);
      onSuccess?.();
    } catch (err: unknown) {
      console.error("Ошибка отправки формы:", err);
      setServerError(getErrorMessage(err));
    }
  };

  if (done) {
    return (
      <div className="leadform leadform--thanks" role="status" aria-live="polite">
        <div className="leadform-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path
              d="M20.3 6.7 9.6 17.4 5 12.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="leadform-thanksTitle">Заявка отправлена</h3>

        <p className="leadform-thanksText">
          Спасибо! Мы свяжемся с вами по указанному номеру. Обычно отвечаем в течение{" "}
          <b>10–15 минут</b> в рабочее время (7:00–19:00 МСК).
        </p>

        <p className="leadform-thanksHint">
          Хотите быстрее? Позвоните:&nbsp;
          <a href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
        </p>

        <button
          className="lf-btn lf-btn--primary"
          type="button"
          onClick={() => {
            setDone(false);
            setServerError(null);
          }}
          style={{ marginTop: 12 }}
        >
          Новая заявка
        </button>
      </div>
    );
  }

  return (
    <form className="leadform" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        name="company"
        onChange={(e) => (honeypotValue.current = e.target.value)}
      />

      <div className="leadform-grid">
        {/* Имя */}
        <div className="leadform-row">
          <label className="leadform-label" htmlFor="lf-name">
            Имя
          </label>

          <div className={`lf-field ${errors.name ? "has-error" : ""}`}>
            <span className="lf-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.5V21h16v-2.5C20 16.17 16.33 14 12 14Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <input
              id="lf-name"
              className="leadform-input"
              placeholder="Ваше имя"
              autoComplete="name"
              {...register("name")}
              aria-invalid={!!errors.name || undefined}
            />
          </div>

          {errors.name && (
            <span className="leadform-error" role="alert">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Телефон */}
        <div className="leadform-row">
          <label className="leadform-label" htmlFor="lf-phone">
            Телефон
          </label>

          <div className={`lf-field ${errors.phone ? "has-error" : ""}`}>
            <span className="lf-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.6 0 1 .4 1 .9v3.5c0 .6-.4 1-1 1C9.8 21 3 14.2 3 5.3c0-.6.4-1 1-1H7.5c.6 0 1 .4 1 .9 0 1.1.2 2.1.6 3.1.1.4.1.9-.2 1.2l-2.3 2.3Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <input
              id="lf-phone"
              className="leadform-input"
              placeholder="+7XXXXXXXXXX"
              inputMode="tel"
              autoComplete="tel"
              {...register("phone")}
              aria-invalid={!!errors.phone || undefined}
            />
          </div>

          {errors.phone && (
            <span className="leadform-error" role="alert">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Сумма долга */}
        <div className="leadform-row leadform-row--wide">
          <label className="leadform-label" htmlFor="lf-debt">
            Сумма долга (≈)
          </label>

          <div className="lf-field">
            <span className="lf-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm1 15h-2v-2H8v-2h3v-2H8V8h3V6h2v2h3v2h-3v2h3v2h-3v2Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <input
              id="lf-debt"
              className="leadform-input"
              placeholder="например, 450 000"
              inputMode="numeric"
              autoComplete="off"
              {...register("debt")}
            />
          </div>
        </div>
      </div>

      {/* Согласие */}
      <label className="leadform-agree">
        <input type="checkbox" {...register("agree")} />
        <span>
          Согласен(а) с{" "}
          <a href="/politika-konfidencialnosti" target="_blank" rel="noreferrer">
            политикой конфиденциальности
          </a>
        </span>
      </label>

      {errors.agree && (
        <span className="leadform-error" role="alert">
          {errors.agree.message}
        </span>
      )}

      {/* Ошибка сервера */}
      {serverError && (
        <div className="leadform-error" style={{ marginTop: 10 }} role="alert">
          {serverError}
        </div>
      )}

      <button
        className="lf-btn lf-btn--primary leadform-submit"
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting || undefined}
      >
        {isSubmitting ? (
          <>
            <span className="lf-spinner" aria-hidden="true" /> Отправляем…
          </>
        ) : (
          <>
            <span className="lf-btnIco" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M2 21 23 12 2 3l4 7 9 2-9 2-4 7Z" fill="currentColor" />
              </svg>
            </span>
            Получить консультацию
          </>
        )}
      </button>
    </form>
  );
}