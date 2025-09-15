// src/features/LeadForm/LeadForm.tsx
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./LeadForm.module.css";
import axios from "axios";
import Modal from "@shared/ui/Modal/Modal";

/* ======= Схема валидации ======= */
const schema = z.object({
  name: z.string().trim().min(2, "Введите имя"),
  phone: z.string().trim().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  debt: z.string().trim().optional(),
  agree: z.boolean().refine((v) => v === true, { message: "Обязательное согласие" }),
});
type FormData = z.infer<typeof schema>;

/* Доп. пропсы (по желанию) */
type Props = {
  context?: string;        // "landing" | "quiz" и т.п. — уйдёт в payload
  onSuccess?: () => void;  // коллбек после успешной отправки
};

export default function LeadForm({ context = "landing", onSuccess }: Props) {
  const [doneOpen, setDoneOpen] = useState(false);        // состояние модалки “Спасибо”
  const honeypotValue = useRef("");                       // honeypot антиспам

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  /* ======= Отправка ======= */
  const onSubmit = async (data: FormData) => {
    // если бот заполнил honeypot — не отправляем запрос, но ведём себя как успех
    if (honeypotValue.current) {
      reset();
      setDoneOpen(true);
      onSuccess?.();
      return;
    }

    const payload = {
      ...data,
      context,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      ts: Date.now(),
    };

    try {
      // TODO: включите реальный endpoint или прокси
      // await axios.post("/api/lead", payload);
      await new Promise((r) => setTimeout(r, 600)); // имитация запроса

      reset();
      setDoneOpen(true);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      // при желании можно показать отдельную "ошибочную" модалку (variant="error")
      setDoneOpen(true);
    }
  };

  return (
    <>
      {/* ФОРМА */}
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Форма быстрой заявки"
      >
        {/* Honeypot — физически в DOM, но невидим для человека */}
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
        <div className={styles.row}>
          <input
            className="input"
            placeholder="Ваше имя"
            autoComplete="name"
            {...register("name")}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span id="name-error" className={styles.err}>
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Телефон */}
        <div className={styles.row}>
          <input
            className="input"
            placeholder="+7XXXXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <span id="phone-error" className={styles.err}>
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Сумма долга (необяз.) */}
        <div className={styles.row}>
          <input
            className="input"
            placeholder="Сумма долга (≈)"
            inputMode="numeric"
            autoComplete="off"
            {...register("debt")}
          />
        </div>

        {/* Согласие */}
        <label className={styles.agree}>
          <input type="checkbox" {...register("agree")} />
          <span>
            Согласен(а) с{" "}
            <a href="/politika-konfidencialnosti" target="_blank" rel="noreferrer">
              политикой
            </a>
          </span>
        </label>
        {errors.agree && <span className={styles.err}>{errors.agree.message}</span>}

        {/* Кнопка */}
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Отправляем..." : "Получить консультацию"}
        </button>
      </form>

      {/* МОДАЛКА “СПАСИБО” — центр, блюр фона, аккуратный дизайн */}
      <Modal
        open={doneOpen}
        onClose={() => setDoneOpen(false)}
        title="Заявка отправлена"
        variant="success"          // зелёный акцент + иконка-статус
        width={560}                // max-width карточки
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setDoneOpen(false)}>
              Закрыть
            </button>
            <a className="btn btn-primary" href="/uslugi" onClick={() => setDoneOpen(false)}>
              Смотреть услуги
            </a>
          </>
        }
      >
        <p style={{ margin: 0, opacity: 0.95 }}>
          Спасибо! Мы свяжемся с вами в ближайшее время по указанному номеру.
          Обычно отвечаем в течение <b>10–15 минут</b> в рабочее время (7:00–19:00 МСК).
        </p>
        <div style={{ height: 8 }} />
        <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>
          Хотите быстрее? Позвоните:&nbsp;
          <a href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
        </p>
      </Modal>
    </>
  );
}