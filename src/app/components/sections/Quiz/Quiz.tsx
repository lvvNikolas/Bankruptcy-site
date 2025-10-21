"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LeadForm from "@components/LeadForm/LeadForm";
import "@styles/Quiz.css";

/** Типы */
type Option = { id: string; label: string };
type Question = { id: string; title: string; options: Option[]; multiple?: boolean };
type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

/** Конфиг опроса (6 вопросов) */
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

/** Ключи localStorage */
const LS = {
  step: "quiz.step",
  answers: "quiz.answers",
  completed: "quiz.completed",
} as const;

export default function Quiz() {
  const total = QUESTIONS.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);

  const q = QUESTIONS[step];
  const formRef = useRef<HTMLDivElement | null>(null);

  /** Условие «вопрос отвечен» */
  const isAnswered = (question: Question) => {
    const v = answers[question.id];
    return question.multiple
      ? Array.isArray(v) && v.length > 0
      : typeof v === "string" && !!v;
  };

  /** Можно перейти на следующий шаг */
  const canProceed = completed ? true : isAnswered(q);

  /** Прогресс */
  const progress = useMemo(
    () => Math.round(((completed ? total : step + 1) / total) * 100),
    [step, total, completed]
  );

  /** Восстановление состояния */
  useEffect(() => {
    try {
      const s = Number(localStorage.getItem(LS.step) ?? "0");
      const a = JSON.parse(localStorage.getItem(LS.answers) ?? "{}") as Answers;
      const c = localStorage.getItem(LS.completed) === "1";
      if (s >= 0 && s < total) setStep(s);
      if (a && typeof a === "object") setAnswers(a);
      if (c) setCompleted(true);
    } catch {/* ignore */}
  }, [total]);

  /** Сохранение состояния */
  useEffect(() => {
    try {
      localStorage.setItem(LS.step, String(step));
      localStorage.setItem(LS.answers, JSON.stringify(answers));
      localStorage.setItem(LS.completed, completed ? "1" : "0");
    } catch {/* ignore */}
  }, [step, answers, completed]);

  /** Выбор вариантов */
  const chooseSingle = (qid: string, id: string) => {
    setAnswers((p) => ({ ...p, [qid]: id }));
    if (error) setError("");
  };
  const toggleMulti = (qid: string, id: string) => {
    setAnswers((p) => {
      const v = p[qid];
      const arr = Array.isArray(v) ? v : [];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...p, [qid]: next };
    });
    if (error) setError("");
  };

  /** Навигация */
  const onNext = () => {
    if (!isAnswered(q)) return setError("Выберите вариант(ы) ответа");
    if (step < total - 1) setStep((s) => s + 1);
    else setShowVerdict(true);
  };
  const onBack = () => setStep((s) => Math.max(0, s - 1));

  const toForm = () => {
    setShowVerdict(false);
    setCompleted(true);
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  /** Сброс без прокрутки (по требованию) */
  const reset = () => {
    setStep(0);
    setAnswers({});
    setError("");
    setCompleted(false);
    setShowVerdict(false);
    try {
      localStorage.removeItem(LS.step);
      localStorage.removeItem(LS.answers);
      localStorage.removeItem(LS.completed);
    } catch {/* ignore */}
    // Никакой прокрутки тут не делаем
  };

  /** Сводка выбранных ответов */
  const summary = useMemo(() => {
    const res: Array<[string, string]> = [];
    for (const question of QUESTIONS) {
      const v = answers[question.id];
      if (v === undefined) continue;
      if (question.multiple) {
        const labels = (v as string[])
          .map((id) => question.options.find((o) => o.id === id)?.label)
          .filter(Boolean) as string[];
        if (labels.length) res.push([question.title, labels.join(", ")]);
      } else {
        const label = question.options.find((o) => o.id === v)?.label;
        if (label) res.push([question.title, label]);
      }
    }
    return res;
  }, [answers]);

  return (
    <section id="quiz" className="quiz">
      {/* Слоган в начале секции, вне формы */}
      <div className="container">
        <h2 className="quiz-title">
          Ответьте на 6 вопросов и получите <br /> персональную консультацию
        </h2>
      </div>

      <div className="quiz-bordered">
        <div className="quiz-inner container">
          {/* Прогресс */}
          <div className="quiz-bar" aria-label={`Прогресс: ${progress}%`}>
            <div className="quiz-progress" style={{ width: `${progress}%` }} />
          </div>

          {/* Сетка 2 колонки (равные высоты на десктопе) */}
          <div className="quiz-grid equal-cols">
            {/* Левая колонка */}
            <aside className="quiz-aside">
              <div>
                <div className="quiz-person">
                  <div className="quiz-avatar" aria-hidden />
                  <div>
                    <div className="quiz-personName">Марийка Иерусалимская</div>
                    <div className="quiz-personRole">Юрист практики банкротства</div>
                  </div>
                </div>
                <p className="quiz-note">
                  Осталось {Math.max(total - (step + 1), 0)} вопрос(а). Отвечайте честно — так мы
                  точнее оценим ситуацию и дадим персональные рекомендации.
                </p>
              </div>
            </aside>

            {/* Правая колонка */}
            <div className="quiz-panel">
              {!completed ? (
                <>
                  <h3 className="quiz-qTitle">
                    <span className="quiz-qNum">{step + 1}.</span>
                    {q.title}
                  </h3>

                  {q.multiple && (
                    <div className="quiz-hint">* можно выбрать несколько вариантов ответа</div>
                  )}

                  {/* Варианты */}
                  <div className="quiz-options">
                    {q.options.map((opt) => {
                      const checked = q.multiple
                        ? Array.isArray(answers[q.id]) &&
                          (answers[q.id] as string[]).includes(opt.id)
                        : answers[q.id] === opt.id;

                      return (
                        <label key={opt.id} className={`quiz-card ${checked ? "is-checked" : ""}`}>
                          <input
                            type={q.multiple ? "checkbox" : "radio"}
                            name={q.id}
                            value={opt.id}
                            checked={checked}
                            onChange={() =>
                              q.multiple
                                ? toggleMulti(q.id, opt.id)
                                : chooseSingle(q.id, opt.id)
                            }
                          />
                          <span className={q.multiple ? "quiz-box" : "quiz-circle"} />
                          <span className="quiz-label">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Ошибка шага */}
                  {error && <div className="quiz-error">{error}</div>}

                  {/* Кнопки */}
                  <div className="quiz-actions">
                    <button className="quiz-btn ghost" onClick={onBack} disabled={step === 0}>
                      Назад
                    </button>
                    <button
                      className="quiz-btn primary"
                      onClick={onNext}
                      disabled={!canProceed}
                    >
                      {step < total - 1 ? "Далее →" : "Получить результат"}
                    </button>
                  </div>
                </>
              ) : (
                /* Режим «результат + форма» */
                <div ref={formRef} className="quiz-inlineFormWrap">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <h3 className="quiz-resultTitle">Ваш результат</h3>
                    <button className="quiz-btn ghost" onClick={reset}>
                      Пройти заново
                    </button>
                  </div>

                  {summary.length > 0 && (
                    <ul className="quiz-summary">
                      {summary.map(([k, v]) => (
                        <li key={k}>
                          <span>{k}</span>
                          <strong>{v}</strong>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="quiz-inlineForm">
                    <LeadForm context="quiz" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модалка-вердикт */}
      {showVerdict && (
        <div
          className="quiz-modalOverlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setShowVerdict(false)}
        >
          <div className="quiz-modal">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <h4 className="quiz-modalTitle">🎉 Вы подходите под процедуру банкротства</h4>
              <button className="quiz-modalClose" onClick={() => setShowVerdict(false)}>×</button>
            </div>
            <p className="quiz-note" style={{ marginTop: 8 }}>
              Юрист свяжется, уточнит детали и расскажет, как именно она пройдёт в вашем случае.
            </p>
            <ul style={{ margin: "8px 0 16px 18px" }}>
              <li>Оценим сроки и стоимость под вашу ситуацию;</li>
              <li>Подскажем, какие документы понадобятся;</li>
              <li>Ответим на все вопросы.</li>
            </ul>
            <div className="quiz-actions" style={{ justifyContent: "center" }}>
              <button className="quiz-btn ghost" onClick={() => setShowVerdict(false)}>
                Вернуться к ответам
              </button>
              <button className="quiz-btn primary" onClick={toForm}>
                Перейти к форме
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}