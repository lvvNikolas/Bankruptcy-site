"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import "@styles/DebtsChat.css";

/** Корректный тип стиля с CSS-переменной --ani-delay */
type StyleWithDelay = CSSProperties & { ["--ani-delay"]?: string };

export default function DebtsChats() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-ani]"));

    if (prefersReduced) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Готовим стили с переменной без any
  const s0: StyleWithDelay = { ["--ani-delay"]: "0ms" };
  const s1: StyleWithDelay = { ["--ani-delay"]: "120ms" };
  const s2: StyleWithDelay = { ["--ani-delay"]: "240ms" };

  return (
    <section id="debts-chat" ref={rootRef} className="dc section">
      <div className="container dc__container">

        {/* Верхний блок-утверждение */}
        <figure className="dc__bubble dc__bubble--lg dc__bubble--center" data-ani="" style={s0}>
          <div className="dc__bubbleHead">
            <p className="dc__text dc__text--lg">
              Согласно <span className="dc__accent">ФЗ-127 “О банкротстве”</span> любой гражданин
              вправе законно списать все свои долги
            </p>
            <div className="dc__avatar dc__avatar--inline">
              <Image
                src="/media/lawyer.jpg"
                alt="Юрист"
                width={88}
                height={88}
                className="dc__avatarImg"
                priority
              />
            </div>
          </div>
        </figure>

        {/* Нижняя строка: вопрос + ответ */}
        <div className="dc__row">
          <figure className="dc__bubble dc__bubble--md dc__bubble--left" data-ani="" style={s1}>
            <div className="dc__avatar dc__avatar--inline">
              <Image
                src="/media/girl.png"
                alt="Клиент"
                width={84}
                height={84}
                className="dc__avatarImg"
              />
            </div>
            <p className="dc__text">Какие последствия банкротства?</p>
          </figure>

          <figure className="dc__bubble dc__bubble--md dc__bubble--right" data-ani="" style={s2}>
            <div className="dc__avatar dc__avatar--inline">
              <Image
                src="/media/lawyer.jpg"
                alt="Юрист"
                width={84}
                height={84}
                className="dc__avatarImg"
              />
            </div>
            <p className="dc__text">
              Они <span className="dc__accent">минимальны</span>,<br /> не переживайте!
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}