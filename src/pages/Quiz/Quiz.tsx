import { useMemo, useRef, useState } from "react";
import styles from "./Quiz.module.css";
import LeadForm from "@features/LeadForm/LeadForm";

/** Вариант ответа */
type Option = { id: string; label: string };

/** Модель вопроса. multiple=true → чекбоксы (множественный выбор) */
type Question = {
  id: string;
  title: string;
  options: Option[];
  multiple?: boolean;
};

/** Конфигурация опроса (5 вопросов) */
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
    multiple: true, // ← многовариантный вопрос
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

type Props = { withHead?: boolean };

export default function Quiz({ withHead = true }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false); // ← режим: квиз закончен, показываем форму
  const formRef = useRef<HTMLDivElement | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  /** Процент прогресса */
  const progress = useMemo(
    () => Math.round(((completed ? total : step + 1) / total) * 100),
    [step, total, completed]
  );

  /** Проверяем, есть ли ответ на текущий вопрос */
  const isAnswered = (question: Question) => {
    const val = answers[question.id];
    if (question.multiple) return Array.isArray(val) && val.length > 0;
    return typeof val === "string" && !!val;
  };
  const canProceed = completed ? true : isAnswered(q);

  /** Выбор одного варианта (radio) */
  const selectSingle = (qid: string, id: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: id }));
    setError("");
  };

  /** Тоггл для чекбоксов (multiple) */
  const toggleMulti = (qid: string, id: string) => {
    setAnswers((prev) => {
      const prevVal = prev[qid];
      const arr = Array.isArray(prevVal) ? prevVal : [];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...prev, [qid]: next };
    });
    setError("");
  };

  /** Следующий шаг */
  const next = () => {
    if (!isAnswered(q)) {
      setError("Выберите вариант(ы) ответа");
      return;
    }
    if (step < total - 1) setStep((s) => s + 1);
  };

  /** Назад */
  const back = () => {
    if (completed) return; // в режиме формы назад не ходим
    setStep((s) => Math.max(0, s - 1));
  };

  /** Завершение опроса → раскрыть встроенную форму */
  const finish = () => {
    if (!isAnswered(q)) {
      setError("Выберите вариант(ы) ответа");
      return;
    }
    // здесь можно отправить ответы в аналитику/CRM
    console.log("quiz:", answers);
    setCompleted(true);

    // подождём кадр, чтобы DOM применил класс анимации, потом проскроллим к форме
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /** Резюме ответов для вывода над формой */
  const summary = useMemo(() => {
    const map = new Map<string, string>();
    for (const question of QUESTIONS) {
      const val = answers[question.id];
      if (val === undefined) continue;
      if (question.multiple) {
        const arr = (val as string[]).map(
          (id) => question.options.find((o) => o.id === id)?.label
        ).filter(Boolean) as string[];
        if (arr.length) map.set(question.title, arr.join(", "));
      } else {
        const label = question.options.find((o) => o.id === val)?.label;
        if (label) map.set(question.title, label);
      }
    }
    return Array.from(map.entries());
  }, [answers]);

  return (
    <section id="quiz" className="section">
      <div className="container">
        {withHead && (
          <>
            <h2 className="sectionHead">
              Ответьте на 5 вопросов и получите персональную консультацию
            </h2>
            <p className="sectionLead">
              Результат носит предварительный характер — юрист подтвердит детали по телефону.
            </p>
          </>
        )}

        {/* прогресс-бар */}
        <div className={styles.progressWrap} aria-label={`Прогресс: ${progress}%`}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.body}>
          {/* Левая карточка-ассистент */}
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
                  Ответьте ещё на {total - (step + 1)} вопрос(а), чтобы мы точнее оценили ваш кейс.
                </p>
                <small className="text-muted">Шаг: {step + 1}/{total}</small>
              </>
            ) : (
              <>
                <p className={styles.note}>
                  Оставьте контакты — подготовим для вас план действий и назовём сроки/стоимость.
                </p>
                <small className="text-muted">Шаг: {total}/{total}</small>
              </>
            )}
          </aside>

          {/* Правая панель: либо вопросы, либо встроенная форма */}
          <div className={styles.panel}>
            {!completed ? (
              <>
                <div className={styles.qTitle}>
                  <span className={styles.qNum}>{step + 1}.</span> {q.title}
                </div>

                {q.multiple && (
                  <div className={styles.hint}>* можно выбрать несколько вариантов ответа</div>
                )}

                {/* Варианты */}
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

                {/* Ошибка */}
                {error && <div className={styles.error}>{error}</div>}

                {/* Навигация */}
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
              /* === Режим результата: резюме ответов + встроенная форма === */
              <div ref={formRef} className={styles.inlineFormWrap}>
                <h3 className={styles.resultTitle}>Ваш результат</h3>

                {/* компактное резюме ответов */}
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
                  {/* если в LeadForm есть поддержка hidden-полей — можно передать answers/summary */}
                  <LeadForm />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}