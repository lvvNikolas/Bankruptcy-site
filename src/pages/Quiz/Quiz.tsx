// src/widgets/Quiz/Quiz.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Quiz.module.css";
import LeadForm from "@features/LeadForm/LeadForm";
import Modal from "@shared/ui/Modal/Modal";

/** Вариант ответа */
type Option = { id: string; label: string };

/** Модель вопроса. multiple=true → чекбоксы (множественный выбор) */
type Question = {
  id: string;
  title: string;
  options: Option[];
  multiple?: boolean;
};

/** Конфигурация опроса (6 вопросов) */
const QUESTIONS: Question[] = [
  {
    id: "debt_total",
    title: "Какая у вас общая сумма долга?",
    options: [
      { id: "lt300", label: "до 300 000 ₽" },
      { id: "300_700", label: "300 000 — 700 000 ₽" },
      { id: "gt700", label: "более 700 000 ₽" },
    ],
  },
  {
    id: "creditors",
    title: "Сколько кредиторов?",
    options: [
      { id: "1", label: "1" },
      { id: "2_4", label: "2–4" },
      { id: "5p", label: "5 и более" },
    ],
  },
  {
    id: "income",
    title: "Есть ли официальный доход?",
    options: [
      { id: "yes", label: "Да" },
      { id: "no", label: "Нет" },
    ],
  },
  {
    id: "property",
    title: "Есть ли имущество, оформленное на вас?",
    multiple: true,
    options: [
      { id: "none", label: "нет" },
      { id: "car", label: "машина" },
      { id: "land", label: "земельный участок" },
      { id: "flat", label: "квартира" },
      { id: "house", label: "дача / частный дом" },
      { id: "other", label: "другое" },
    ],
  },
  {
    id: "loans",
    title: "Есть автокредит или ипотека?",
    options: [
      { id: "mortgage", label: "Ипотека" },
      { id: "carloan", label: "Автокредит" },
      { id: "both", label: "И то и то" },
      { id: "none", label: "Нет" },
    ],
  },
  {
    id: "enforcement",
    title: "Есть ли исполнительные производства?",
    options: [
      { id: "running", label: "Да, ведутся" },
      { id: "closed", label: "Были, закрыты" },
      { id: "no", label: "Нет" },
    ],
  },
];

/** Значение ответа: строка (radio) или массив строк (checkbox) */
type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;
type Props = { withHead?: boolean };

/** ключи для localStorage */
const LS_KEY = {
  step: "quiz.step",
  answers: "quiz.answers",
  completed: "quiz.completed",
} as const;

export default function Quiz({ withHead = true }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);     // показ встроенной формы
  const [showQualify, setShowQualify] = useState(false); // модал «вы подходите»
  const formRef = useRef<HTMLDivElement | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  /** Прогресс (когда показываем форму — считаем 100%) */
  const progress = useMemo(
    () => Math.round(((completed ? total : step + 1) / total) * 100),
    [step, total, completed]
  );

  /** ====== восстановление состояния ====== */
  useEffect(() => {
    try {
      const savedStep = Number(localStorage.getItem(LS_KEY.step) ?? "0");
      const savedAnswers = JSON.parse(localStorage.getItem(LS_KEY.answers) ?? "{}") as Answers;
      const savedCompleted = localStorage.getItem(LS_KEY.completed) === "1";
      if (savedStep >= 0 && savedStep < total) setStep(savedStep);
      if (savedAnswers && typeof savedAnswers === "object") setAnswers(savedAnswers);
      if (savedCompleted) setCompleted(true);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ====== сохранение состояния ====== */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY.step, String(step));
      localStorage.setItem(LS_KEY.answers, JSON.stringify(answers));
      localStorage.setItem(LS_KEY.completed, completed ? "1" : "0");
    } catch {
      /* приватный режим / квота — ок */
    }
  }, [step, answers, completed]);

  /** валидация текущего шага */
  const isAnswered = (question: Question) => {
    const val = answers[question.id];
    if (question.multiple) return Array.isArray(val) && val.length > 0;
    return typeof val === "string" && !!val;
  };
  const canProceed = completed ? true : isAnswered(q);

  /** выбор */
  const selectSingle = (qid: string, id: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: id }));
    if (error) setError("");
  };
  const toggleMulti = (qid: string, id: string) => {
    setAnswers((prev) => {
      const prevVal = prev[qid];
      const arr = Array.isArray(prevVal) ? prevVal : [];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...prev, [qid]: next };
    });
    if (error) setError("");
  };

  /** шаги */
  const next = () => {
    if (!isAnswered(q)) {
      setError("Выберите вариант(ы) ответа");
      return;
    }
    if (step < total - 1) setStep((s) => s + 1);
  };
  const back = () => {
    if (completed) return; // в режиме формы назад не ходим
    setStep((s) => Math.max(0, s - 1));
  };

  /** завершение → модал «поздравляем» */
  const finish = () => {
    if (!isAnswered(q)) {
      setError("Выберите вариант(ы) ответа");
      return;
    }
    // сюда можно отправить answers в аналитику/CRM
    console.log("quiz:", answers);
    setShowQualify(true);
  };

  /** перейти к форме из модалки */
  const proceedToForm = () => {
    setShowQualify(false);
    setCompleted(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /** «Пройти заново» */
  const resetAll = () => {
    setStep(0);
    setAnswers({});
    setError("");
    setCompleted(false);
    setShowQualify(false);
    try {
      localStorage.removeItem(LS_KEY.step);
      localStorage.removeItem(LS_KEY.answers);
      localStorage.removeItem(LS_KEY.completed);
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** резюме ответов для панели «Ваш результат» */
  const summary = useMemo(() => {
    const map = new Map<string, string>();
    for (const question of QUESTIONS) {
      const val = answers[question.id];
      if (val === undefined) continue;
      if (question.multiple) {
        const arr = (val as string[])
          .map((id) => question.options.find((o) => o.id === id)?.label)
          .filter(Boolean) as string[];
        if (arr.length) map.set(question.title, arr.join(", "));
      } else {
        const label = question.options.find((o) => o.id === val)?.label;
        if (label) map.set(question.title, label);
      }
    }
    return Array.from(map.entries());
  }, [answers]);

  /** клавиатурная навигация (блокируем, когда открыт модал) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (completed || showQualify) return;
      if (e.key === "Enter") {
        e.preventDefault();
        step < total - 1 ? next() : finish();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, completed, showQualify, answers]);

  return (
    <section id="quiz" className="section">
      <div className="container">
        {withHead && (
          <>
            <h2 className="sectionHead">
              Ответьте на 6 вопросов и получите персональную консультацию
            </h2>
            <p className="sectionLead">
              Результат носит предварительный характер — юрист подтвердит детали по телефону.
            </p>
          </>
        )}

        {/* прогресс (key — перезапуск анимации полосы) */}
        <div className={styles.progressWrap} aria-label={`Прогресс: ${progress}%`}>
          <div
            key={`${step}-${completed ? 1 : 0}`}
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={styles.body}>
          {/* ассистент слева */}
          <aside className={styles.assist}>
            <div className={styles.manager}>
              <div className={styles.avatar} aria-hidden />
              <div>
                <div className={styles.managerName}>Марийка Иерусалимкая</div>
                <div className={styles.managerMeta}>Юрист практики банкротства</div>
              </div>
            </div>

            {!completed ? (
              <>
                <p className={styles.note}>
                  Ответьте ещё на {Math.max(total - (step + 1), 0)} вопрос(а), чтобы мы точнее оценили ваш кейс.
                </p>
                <small className="text-muted">Шаг: {step + 1}/{total}</small>
              </>
            ) : (
              <>
                <p className={styles.note}>
                  Оставьте контакты — подготовим план действий и назовём сроки/стоимость.
                </p>
                <small className="text-muted">Шаг: {total}/{total}</small>
              </>
            )}
          </aside>

          {/* правая панель */}
          <div className={styles.panel}>
            {!completed ? (
              <>
                <div className={styles.qTitle}>
                  <span className={styles.qNum}>{step + 1}.</span> {q.title}
                </div>

                {q.multiple && (
                  <div className={styles.hint}>* можно выбрать несколько вариантов ответа</div>
                )}

                {/* варианты */}
                <div className={styles.options}>
                  {q.options.map((opt) => {
                    const checked = q.multiple
                      ? Array.isArray(answers[q.id]) &&
                        (answers[q.id] as string[]).includes(opt.id)
                      : answers[q.id] === opt.id;

                    return (
                      <label
                        key={opt.id}
                        className={`${styles.option} ${checked ? styles.optionChecked : ""}`}
                      >
                        <input
                          type={q.multiple ? "checkbox" : "radio"}
                          name={q.id}
                          value={opt.id}
                          checked={checked}
                          onChange={() =>
                            q.multiple
                              ? toggleMulti(q.id, opt.id)
                              : selectSingle(q.id, opt.id)
                          }
                        />
                        <span className={q.multiple ? styles.checkbox : styles.radio} />
                        <span className={styles.label}>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* ошибка шага */}
                {error && (
                  <div className={styles.error} role="alert" aria-live="polite">
                    {error}
                  </div>
                )}

                {/* навигация */}
                <div className={styles.nav}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={back}
                    disabled={step === 0}
                  >
                    Назад
                  </button>

                  {step < total - 1 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={next}
                      disabled={!canProceed}
                    >
                      Далее →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={finish}
                      disabled={!canProceed}
                    >
                      Получить результат
                    </button>
                  )}
                </div>
              </>
            ) : (
              // режим «результат + форма»
              <div ref={formRef} className={styles.inlineFormWrap}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 className={styles.resultTitle}>Ваш результат</h3>
                  <button type="button" className="btn btn-ghost" onClick={resetAll}>
                    Пройти заново
                  </button>
                </div>

                {summary.length > 0 && (
                  <ul className={styles.summary}>
                    {summary.map(([key, val]) => (
                      <li key={key}>
                        <span>{key}</span>
                        <strong>{val}</strong>
                      </li>
                    ))}
                  </ul>
                )}

                <div className={styles.inlineForm}>
                  <LeadForm context="quiz" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалка-вердикт перед формой */}
     <Modal
  open={showQualify}
  onClose={() => setShowQualify(false)}
  title=""
  width={560}
>
  <div style={{ textAlign: "left" }}>
    {/* Заголовок */}
    <h3
      style={{
        fontSize: "20px",
        fontWeight: 700,
        margin: "0 0 12px 0",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span role="img" aria-label="party">🎉</span>
      Поздравляем! Вы подходите под процедуру банкротства
    </h3>

    {/* Текст */}
    <p style={{ marginTop: 0, marginBottom: 12, color: "var(--muted)" }}>
      По вашим ответам вы потенциально подходите под процедуру. Юрист уточнит детали
      и расскажет, как именно она пройдёт в вашем случае.
    </p>

    <ul style={{ margin: "0 0 16px 18px", opacity: 0.9 }}>
      <li>оценим сроки и стоимость под вашу ситуацию;</li>
      <li>подскажем, какие документы понадобятся;</li>
      <li>ответим на любые вопросы.</li>
    </ul>

    {/* Кнопки */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        marginTop: 24,
        paddingBottom: 8, // отступ снизу
      }}
    >
      <button
        type="button"
        className="btn btn-ghost"
        style={{ minWidth: 180, height: 44 }}
        onClick={() => setShowQualify(false)}
      >
        Изменить ответы
      </button>
      <button
        type="button"
        className="btn btn-primary"
        style={{ minWidth: 180, height: 44 }}
        onClick={proceedToForm}
      >
        Перейти к форме
      </button>
    </div>
  </div>
</Modal>
    </section>
  );
}