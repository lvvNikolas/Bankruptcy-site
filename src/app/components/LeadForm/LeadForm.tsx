"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "@styles/LeadForm.css";

/* ======= Схема валидации ======= */
const schema = z.object({
  name: z.string().trim().min(2, "Введите имя"),
  phone: z.string().trim().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  debt: z.string().trim().optional(),
  agree: z.boolean().refine((v) => v === true, { message: "Обязательное согласие" }),
});

type FormData = z.infer<typeof schema>;

type Props = {
  context?: string;
  formId?: string;
  /** Любые доп.данные (например ответы квиза) */
  extraData?: Record<string, unknown>;
  onSuccess?: () => void;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Ошибка отправки. Попробуйте ещё раз.";
}

function getApiErrorMessage(json: unknown): string | null {
  if (json && typeof json === "object" && "error" in json) {
    const maybeError = (json as Record<string, unknown>).error;
    if (typeof maybeError === "string" && maybeError.trim()) return maybeError;
  }
  return null;
}

function normalizePhone(raw: string): string {
  if (!raw) return raw;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("7")) return "+7" + digits.slice(1, 11);
  if (digits.startsWith("8")) return "+7" + digits.slice(1, 11);
  if (raw.startsWith("+7")) return "+7" + digits.slice(1, 11);
  return "+7" + digits.slice(0, 10);
}

export default function LeadForm({
  context = "landing",
  formId = "lead_default",
  extraData,
  onSuccess,
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

  useEffect(() => {
    if (!phone) return;
    const normalized = normalizePhone(phone);
    if (normalized !== phone) setValue("phone", normalized, { shouldValidate: false });
  }, [phone, setValue]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    // антибот
    if (honeypotValue.current) {
      reset();
      setDone(true);
      onSuccess?.();
      return;
    }

    const page = typeof window !== "undefined" ? window.location.href : "";
    const timeOnPageMs = Date.now() - mountedAt;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          context,
          formId,
          page,
          ts: Date.now(),
          timeOnPageMs,
          extraData: extraData ?? null, // ✅
        }),
      });

      const json: unknown = await res.json().catch(() => ({}));

      if (!res.ok) {
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
        <h3 className="leadform-thanksTitle">Заявка отправлена ✅</h3>
        <p className="leadform-thanksText">
          Спасибо! Мы свяжемся с вами по указанному номеру.
          Обычно отвечаем в течение <b>10–15 минут</b> в рабочее время (7:00–19:00 МСК).
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
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        name="company"
        onChange={(e) => (honeypotValue.current = e.target.value)}
      />

      {/* Имя */}
      <div className="leadform-row">
        <label className="leadform-label" htmlFor="lf-name">Имя</label>
        <input
          id="lf-name"
          className="leadform-input"
          placeholder="Ваше имя"
          autoComplete="name"
          {...register("name")}
          aria-invalid={!!errors.name || undefined}
        />
        {errors.name && <span className="leadform-error">{errors.name.message}</span>}
      </div>

      {/* Телефон */}
      <div className="leadform-row">
        <label className="leadform-label" htmlFor="lf-phone">Телефон</label>
        <input
          id="lf-phone"
          className="leadform-input"
          placeholder="+7XXXXXXXXXX"
          inputMode="tel"
          autoComplete="tel"
          {...register("phone")}
          aria-invalid={!!errors.phone || undefined}
        />
        {errors.phone && <span className="leadform-error">{errors.phone.message}</span>}
      </div>

      {/* Долг */}
      <div className="leadform-row">
        <label className="leadform-label" htmlFor="lf-debt">Сумма долга (≈)</label>
        <input
          id="lf-debt"
          className="leadform-input"
          placeholder="например, 450 000"
          inputMode="numeric"
          autoComplete="off"
          {...register("debt")}
        />
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
      {errors.agree && <span className="leadform-error">{errors.agree.message}</span>}

      {serverError && (
        <div className="leadform-error" style={{ marginTop: 10 }} role="alert">
          {serverError}
        </div>
      )}

      <button className="btn btn-primary leadform-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправляем..." : "Получить консультацию"}
      </button>
    </form>
  );
}