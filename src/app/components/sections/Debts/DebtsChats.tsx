"use client";

import { useEffect, useRef } from "react";
import "@styles/DebtsChats.css";

type Props = {
  /** Показывать заголовок секции (для лендинга — обычно false) */
  withHead?: boolean;
};

type Bubble = {
  id: string;
  side: "left" | "right"; // слева — клиент, справа — эксперт
  html: string;           // допускаем <strong>/<mark> для акцентов
  avatar?: string;
  alt?: string;
};

/** Контент диалога */
const BUBBLES: Bubble[] = [
  {
    id: "law",
    side: "right",
    html:
      'Согласно <mark>ФЗ-127 “О банкротстве”</mark> любой гражданин вправе <strong>законно списать</strong> все свои долги.',
    alt: "Юрист",
  },
  { id: "q1", side: "left",  html: "Какие последствия банкротства?",                  alt: "Клиент" },
  { id: "ans1", side: "right", html: "Они <mark>минимальны</mark>, не переживайте! Мы заранее объясним, что и как будет происходить.", alt: "Юрист" },
  { id: "q2", side: "left",  html: "Сколько по времени обычно занимает процедура?",   alt: "Клиент" },
  { id: "ans2", side: "right", html: "В среднем от <strong>4 до 9 месяцев</strong> — зависит от ситуации и формата (судебный / внесудебный).", alt: "Юрист" },
];

export default function DebtsChat({ withHead = true }: Props) {
  const rowsRef = useRef<HTMLDivElement[]>([]);

  // Плавное появление пузырей при прокрутке
  useEffect(() => {
    const els = rowsRef.current.filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("debtschat-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { root: null, threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="debts-chat" className="section debtschat-section">
      <div className="container">
        {withHead && (
          <>
            <h2 className="sectionHead">Вопрос–ответ: банкротство простыми словами</h2>
            <p className="sectionLead">
              Короткий диалог про 127-ФЗ, сроки и последствия — без сложных терминов.
            </p>
          </>
        )}

        <div className="debtschat-stage" aria-label="Диалог клиента и юриста">
          {BUBBLES.map((b, i) => {
            const sideClass = b.side === "left" ? "debtschat-left" : "debtschat-right";
            return (
              <div
                key={b.id}
                ref={(el) => { if (el) rowsRef.current[i] = el; }}
                className={`debtschat-row ${sideClass}`}
              >
                {b.side === "left" ? (
                  <>
                    <div className="debtschat-avatar" aria-hidden="true">
                      {/* Можно заменить на <img src={b.avatar!} alt={b.alt ?? ""} /> */}
                      <span className="debtschat-avatarStub">🙂</span>
                    </div>
                    <div
                      className="debtschat-bubble"
                      dangerouslySetInnerHTML={{ __html: b.html }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className="debtschat-bubble"
                      dangerouslySetInnerHTML={{ __html: b.html }}
                    />
                    <div className="debtschat-avatar" aria-hidden="true">
                      <span className="debtschat-avatarStub">👨‍⚖️</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}