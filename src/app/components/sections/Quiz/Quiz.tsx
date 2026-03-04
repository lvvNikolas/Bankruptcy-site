"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import LeadForm from "@components/LeadForm/LeadForm";
import "@styles/Quiz.css";

type Option = { id: string; label: string };
type Question = { id: string; title: string; options: Option[]; multiple?: boolean };
type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

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

const LS = {
  step: "quiz.step",
  answers: "quiz.answers",
  completed: "quiz.completed",
} as const;

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default function Quiz() {
  const total = QUESTIONS.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [showVerdict, setShowVerdict] = useState(false);

  const formAnchorRef = useRef<HTMLDivElement | null>(null);

  const q = QUESTIONS[step];

  const isAnswered = useCallback(
    (question: Question) => {
      const v = answers[question.id];
      if (question.multiple) return Array.isArray(v) && v.length > 0;
      return typeof v === "string" && v.trim().length > 0;
    },
    [answers]
  );

  const progress = useMemo(() => {
    const n = completed ? total : step + 1;
    return Math.round((n / total) * 100);
  }, [completed, step, total]);

  // Резюме (человеческий вид)
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

  // restore
  useEffect(() => {
    try {
      const s = Number(localStorage.getItem(LS.step) ?? "0");
      const a = safeParse<Answers>(localStorage.getItem(LS.answers), {});
      const c = localStorage.getItem(LS.completed) === "1";

      if (Number.isFinite(s) && s >= 0 && s < total) setStep(s);
      if (a && typeof a === "object") setAnswers(a);
      if (c) setCompleted(true);
    } catch {
      /* ignore */
    }
  }, [total]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS.step, String(step));
      localStorage.setItem(LS.answers, JSON.stringify(answers));
      localStorage.setItem(LS.completed, completed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [step, answers, completed]);

  const chooseSingle = (qid: string, id: string) => {
    setAnswers((p) => ({ ...p, [qid]: id }));
    if (error) setError("");
  };

  const toggleMulti = (qid: string, id: string) => {
    setAnswers((p) => {
      const prev = Array.isArray(p[qid]) ? (p[qid] as string[]) : [];
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      return { ...p, [qid]: next };
    });
    if (error) setError("");
  };

  const onBack = () => setStep((s) => Math.max(0, s - 1));

  const onNext = () => {
    if (!isAnswered(q)) {
      setError("Выберите вариант(ы) ответа");
      return;
    }
    if (step < total - 1) setStep((s) => s + 1);
    else setShowVerdict(true);
  };

  const goToForm = () => {
    setShowVerdict(false);
    setCompleted(true);

    requestAnimationFrame(() => {
      formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setCompleted(false);
    setShowVerdict(false);
    setError("");

    try {
      localStorage.removeItem(LS.step);
      localStorage.removeItem(LS.answers);
      localStorage.removeItem(LS.completed);
    } catch {
      /* ignore */
    }
  };

  const canProceed = completed ? true : isAnswered(q);

  return (
    <section id="quiz" className="quiz section" aria-label="Квиз">
      <div className="container quiz__head">
        <p className="quiz__eyebrow">6 вопросов · Бесплатно</p>
        <h2 className="quiz__title">
          Ответьте на 6 вопросов и получите <br /> персональную консультацию
        </h2>
      </div>

      <div className="quiz__box">
        <div className="quiz__inner container">
          <div className="quiz__bar" aria-label={`Прогресс: ${progress}%`}>
            <div className="quiz__progress" style={{ width: `${progress}%` }} />
          </div>

          <div className="quiz__grid">
            {/* LEFT */}
            <aside className="quiz__aside">
              <div className="quiz__person">
                <div className="quiz__avatar">
                  <Image
                    src="/media/Mari.jpg"
                    alt="Юрист"
                    fill
                    sizes="56px"
                    className="quiz__avatarImg"
                  />
                </div>
                <div>
                  <div className="quiz__personName">Марийка Иерусалимская</div>
                  <div className="quiz__personRole">Юрист по банкротству</div>
                </div>
              </div>

              <p className="quiz__note">
                Отвечайте честно — это поможет точнее оценить вашу ситуацию и подобрать оптимальный путь.
              </p>
            </aside>

            {/* RIGHT */}
            <div className="quiz__panel">
              {!completed ? (
                <>
                  <h3 className="quiz__question">
                    <span className="quiz__qNum">{step + 1}.</span> {q.title}
                  </h3>

                  {q.multiple && <div className="quiz__hint">Можно выбрать несколько вариантов</div>}

                  <div className="quiz__options">
                    {q.options.map((opt) => {
                      const checked = q.multiple
                        ? Array.isArray(answers[q.id]) &&
                          (answers[q.id] as string[]).includes(opt.id)
                        : answers[q.id] === opt.id;

                      return (
                        <label key={opt.id} className={`quiz__card ${checked ? "is-checked" : ""}`}>
                          <input
                            type={q.multiple ? "checkbox" : "radio"}
                            name={q.id}
                            value={opt.id}
                            checked={checked}
                            onChange={() => (q.multiple ? toggleMulti(q.id, opt.id) : chooseSingle(q.id, opt.id))}
                          />
                          <span className={q.multiple ? "quiz__boxMark" : "quiz__circle"} />
                          <span className="quiz__label">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {error && <div className="quiz__error">{error}</div>}

                  <div className="quiz__actions">
                    <button className="quiz-btn ghost" onClick={onBack} disabled={step === 0}>
                      Назад
                    </button>
                    <button className="quiz-btn primary" onClick={onNext} disabled={!canProceed}>
                      {step < total - 1 ? "Далее →" : "Получить результат"}
                    </button>
                  </div>
                </>
              ) : (
                <div ref={formAnchorRef} className="quiz__result">
                  <div className="quiz__resultHead">
                    <h3>Ваш результат</h3>
                    <button className="quiz-btn ghost" onClick={reset}>
                      Пройти заново
                    </button>
                  </div>

                  {summary.length > 0 && (
                    <ul className="quiz__summary">
                      {summary.map(([k, v]) => (
                        <li key={k}>
                          <span>{k}</span>
                          <strong>{v}</strong>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* ✅ ТУТ главное: отправляем вместе с формой ответы квиза */}
                  <LeadForm
                    context="quiz"
                    formId="quiz_form"
                    extraData={{
                      quiz: {
                        answers,     // raw ids
                        summary,     // human-readable
                        stepCount: total,
                        completedAt: Date.now(),
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showVerdict && (
        <div className="quiz__overlay" onClick={(e) => e.target === e.currentTarget && setShowVerdict(false)}>
          <div className="quiz__modal">
            <div className="quiz__modalHeader">
              <h4>🎉 Вы подходите под процедуру банкротства</h4>
              <button className="quiz__close" onClick={() => setShowVerdict(false)}>
                ×
              </button>
            </div>

            <p>Юрист свяжется, уточнит детали и расскажет, как именно всё пройдёт в вашем случае.</p>

            <ul>
              <li>Оценим сроки и стоимость под вашу ситуацию;</li>
              <li>Подскажем, какие документы понадобятся;</li>
              <li>Ответим на все вопросы.</li>
            </ul>

            <div className="quiz__actions" style={{ justifyContent: "center" }}>
              <button className="quiz-btn ghost" onClick={() => setShowVerdict(false)}>
                Вернуться к ответам
              </button>
              <button className="quiz-btn primary" onClick={goToForm}>
                Перейти к форме
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}