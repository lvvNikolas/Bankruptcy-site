"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "@styles/LeadForm.css";
import {
  METRIKA_ID,
  PHONE_HREF,
  PHONE_DISPLAY,
  WORKING_HOURS_SHORT,
} from "@/config";
import {
  normalizePhone,
  getErrorMessage,
  getApiErrorMessage,
  safeJson,
} from "@/utils/form";

/* =========================
   ВАЛИДАЦИЯ
========================= */

const schema = z.object({
  name:  z.string().trim().min(2, "Введите имя"),
  phone: z.string().trim().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  debt:  z.string().trim().optional(),
  agree: z.boolean().refine((v) => v === true, { message: "Обязательное согласие" }),
});

type FormData = z.infer<typeof schema>;

/* =========================
   ПРОПСЫ
========================= */

type Props = {
  /** Откуда отправлена форма — попадает в письмо и метрику (напр. "hero", "floating_cta") */
  context?: string;
  /** Уникальный ID формы для идентификации в письме */
  formId?: string;
  /** Дополнительные данные (например, результаты квиза) */
  extraData?: Record<string, unknown> | null;
  /** Callback после успешной отправки (используется для закрытия модала/попапа) */
  onSuccess?: () => void;
  /**
   * URL для отправки формы:
   * - "/lead.php"  — статический сайт на внешнем хостинге (по умолчанию)
   * - "/api/lead"  — Next.js API route
   */
  actionUrl?: string;
  /**
   * Перенаправить на /spasibo/ после успешной отправки.
   * Включать для основной формы лендинга — обеспечивает конверсионный tracking.
   * Для попапов и модалок оставлять false (форма остаётся на месте).
   */
  redirectOnSuccess?: boolean;
};

/* =========================
   YANDEX METRIKA (глобальный тип)
========================= */

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
  }
}

/* =========================
   КОМПОНЕНТ
========================= */

export default function LeadForm({
  context          = "landing",
  formId           = "lead_default",
  extraData        = null,
  onSuccess,
  actionUrl        = "/lead.php",
  redirectOnSuccess = false,
}: Props) {
  const router = useRouter();

  const [done,        setDone]        = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Скрытое honeypot-поле — реальный пользователь его не трогает
  const honeypotValue = useRef("");

  // Время монтирования для определения скорости заполнения формы (антибот)
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

  // Автоформат телефона в +7XXXXXXXXXX на каждое изменение поля
  useEffect(() => {
    if (!phone) return;
    const normalized = normalizePhone(phone);
    if (normalized !== phone) setValue("phone", normalized, { shouldValidate: false });
  }, [phone, setValue]);

  /* ── Отправка ──────────────────────────────────────── */

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    // Антибот: honeypot заполнен → имитируем успех без реальной отправки
    if (honeypotValue.current) {
      reset();
      setDone(true);
      onSuccess?.();
      return;
    }

    const page        = typeof window !== "undefined" ? window.location.href : "";
    const timeOnPageMs = Date.now() - mountedAt;

    const payload: Record<string, unknown> = {
      ...data,
      context,
      formId,
      page,
      ts: Date.now(),
      timeOnPageMs,
      extraData: extraData ?? null,
      company: honeypotValue.current, // honeypot поле (пустое у реального юзера)
    };

    try {
      const res  = await fetch(actionUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const json = await safeJson(res);

      // HTTP-ошибка (4xx / 5xx)
      if (!res.ok) {
        const apiMsg = getApiErrorMessage(json);
        const raw    = typeof json._raw === "string" ? `\n${json._raw}` : "";
        throw new Error(apiMsg ?? `Ошибка отправки (HTTP ${res.status}).${raw}`);
      }

      // Сервер явно вернул ok=false
      if (json.ok === false) {
        const apiMsg = getApiErrorMessage(json);
        throw new Error(apiMsg ?? "Ошибка отправки. Попробуйте ещё раз.");
      }

      // ✅ Успешная отправка
      reset();
      setDone(true);

      // Цель Яндекс.Метрики — не прерываем поток при ошибке трекера
      try { window.ym?.(METRIKA_ID, "reachGoal", "form_submitted"); } catch { /* noop */ }

      onSuccess?.();

      // Опциональный редирект на страницу благодарности (для основной формы)
      if (redirectOnSuccess) {
        router.push("/spasibo/" as never);
      }
    } catch (err: unknown) {
      setServerError(getErrorMessage(err));
    }
  };

  /* ── Экран благодарности ───────────────────────────── */

  if (done) {
    return (
      <div className="leadform leadform--thanks" role="status" aria-live="polite">
        {/* Иконка-галочка */}
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
          <b>10–15 минут</b> в рабочее время ({WORKING_HOURS_SHORT}).
        </p>

        <p className="leadform-thanksHint">
          Хотите быстрее? Позвоните:&nbsp;
          <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
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

  /* ── Форма ─────────────────────────────────────────── */

  return (
    <form className="leadform" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — скрытое поле-ловушка для ботов (пользователь не видит) */}
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
        {/* ── Имя ── */}
        <div className="leadform-row">
          <label className="leadform-label" htmlFor="lf-name">
            Имя
          </label>

          <div className={`lf-field ${errors.name ? "has-error" : ""}`}>
            {/* Иконка: пользователь */}
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

        {/* ── Телефон ── */}
        <div className="leadform-row">
          <label className="leadform-label" htmlFor="lf-phone">
            Телефон
          </label>

          <div className={`lf-field ${errors.phone ? "has-error" : ""}`}>
            {/* Иконка: телефонная трубка */}
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

        {/* ── Сумма долга ── */}
        <div className="leadform-row leadform-row--wide">
          <label className="leadform-label" htmlFor="lf-debt">
            Сумма долга (≈)
          </label>

          <div className="lf-field">
            {/* Иконка: монета/рубль */}
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

      {/* ── Согласие с политикой конфиденциальности ── */}
      <label className="leadform-agree">
        <input type="checkbox" {...register("agree")} />
        <span>
          Согласен(а) с{" "}
          <a href="/politika-konfidentsialnosti" target="_blank" rel="noreferrer">
            политикой конфиденциальности
          </a>
        </span>
      </label>

      {errors.agree && (
        <span className="leadform-error" role="alert">
          {errors.agree.message}
        </span>
      )}

      {/* ── Ошибка сервера ── */}
      {serverError && (
        <div className="leadform-error" style={{ marginTop: 10 }} role="alert">
          {serverError}
        </div>
      )}

      {/* ── Кнопка отправки ── */}
      <button
        className="lf-btn lf-btn--primary leadform-submit"
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting || undefined}
      >
        {isSubmitting ? (
          <>
            {/* Спиннер во время отправки */}
            <span className="lf-spinner" aria-hidden="true" /> Отправляем…
          </>
        ) : (
          <>
            {/* Иконка: бумажный самолётик */}
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
