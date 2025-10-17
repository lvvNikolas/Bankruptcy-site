"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "@styles/LeadForm.css";

/* ======= Схема валидации ======= */
const schema = z.object({
  name: z.string().trim().min(2, "Введите имя"),
  phone: z
    .string()
    .trim()
    .regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  debt: z.string().trim().optional(),
  agree: z.boolean().refine((v) => v === true, { message: "Обязательное согласие" }),
});
type FormData = z.infer<typeof schema>;

type Props = {
  context?: string;
  onSuccess?: () => void;
};

export default function LeadForm({ context = "landing", onSuccess }: Props) {
  const [done, setDone] = useState(false);
  const honeypotValue = useRef("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", debt: "", agree: false },
  });

  const onSubmit = async (data: FormData) => {
    if (honeypotValue.current) {
      reset();
      setDone(true);
      onSuccess?.();
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, 600)); // имитация запроса
      reset();
      setDone(true);
      onSuccess?.();
    } catch (err) {
      console.error("Ошибка отправки формы:", err);
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="leadform-thanks">
        <h3>Заявка отправлена ✅</h3>
        <p>
          Спасибо! Мы свяжемся с вами в ближайшее время по указанному номеру.
          Обычно отвечаем в течение <b>10–15 минут</b> в рабочее время (7:00–19:00 МСК).
        </p>
        <p className="text-muted" style={{ marginTop: 8 }}>
          Хотите быстрее? Позвоните:&nbsp;
          <a href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
        </p>
        <button className="btn btn-primary" onClick={() => setDone(false)} style={{ marginTop: 16 }}>
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

      {/* Имя */}
      <div className="leadform-row">
        <input
          className="input"
          placeholder="Ваше имя"
          autoComplete="name"
          {...register("name")}
          aria-invalid={!!errors.name || undefined}
        />
        {errors.name && <span className="leadform-error">{errors.name.message}</span>}
      </div>

      {/* Телефон */}
      <div className="leadform-row">
        <input
          className="input"
          placeholder="+7XXXXXXXXXX"
          inputMode="tel"
          autoComplete="tel"
          {...register("phone")}
          aria-invalid={!!errors.phone || undefined}
        />
        {errors.phone && <span className="leadform-error">{errors.phone.message}</span>}
      </div>

      {/* Сумма долга */}
      <div className="leadform-row">
        <input
          className="input"
          placeholder="Сумма долга (≈)"
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
            политикой
          </a>
        </span>
      </label>
      {errors.agree && <span className="leadform-error">{errors.agree.message}</span>}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправляем..." : "Получить консультацию"}
      </button>
    </form>
  );
}