"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import "@styles/DebtsChat.css";

/** Стиль пузыря с кастомной CSS-переменной задержки анимации */
type StyleWithDelay = CSSProperties & { ["--ani-delay"]?: string };

export default function DebtsChats() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ani]")
    );

    // Если пользователь просит минимум анимаций — сразу показываем всё
    if (prefersReduced) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-in");
            obs.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Задержки для плавного «каскадного» появления
  const s0: StyleWithDelay = { ["--ani-delay"]: "0ms" };
  const s1: StyleWithDelay = { ["--ani-delay"]: "120ms" };
  const s2: StyleWithDelay = { ["--ani-delay"]: "240ms" };

  return (
    <section
      id="debts-chat"
      ref={rootRef}
      className="dc"
      aria-label="Переписка клиента с юристом о банкротстве"
    >
      <div className="container dc__container">
        {/* Верхний большой пузырь-утверждение */}
        <figure
          className="dc__bubble dc__bubble--lg dc__bubble--center"
          data-ani=""
          style={s0}
        >
          <div className="dc__bubbleHead">
            <p className="dc__text dc__text--lg">
              Согласно{" "}
              <span className="dc__accent">ФЗ-127 «О банкротстве»</span> любой
              гражданин вправе законно списать свои долги.
            </p>
            <div className="dc__avatar dc__avatar--inline">
              <Image
                src="/media/lawyer.jpg"
                alt="Юрист-арбитражный управляющий"
                width={88}
                height={88}
                className="dc__avatarImg"
                priority
              />
            </div>
          </div>
        </figure>

        {/* Нижняя строка: вопрос и ответ */}
        <div className="dc__row">
          <figure
            className="dc__bubble dc__bubble--md dc__bubble--left"
            data-ani=""
            style={s1}
          >
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

          <figure
            className="dc__bubble dc__bubble--md dc__bubble--right"
            data-ani=""
            style={s2}
          >
            <div className="dc__avatar dc__avatar--inline">
              <Image
                src="/media/lawyer.jpg"
                alt="Юрист отвечает клиенту"
                width={84}
                height={84}
                className="dc__avatarImg"
              />
            </div>
            <p className="dc__text">
              Они <span className="dc__accent">минимальны</span>, не
              переживайте — всё проходит в рамках закона.
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}