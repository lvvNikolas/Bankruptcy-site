"use client";

import Image from "next/image";
import "@styles/DebtsChat.css";

/**
 * DebtsChats — диалог (светлая/тёмная тема поддерживаются стилями).
 * Аватары находятся ВНУТРИ пузырей за счёт flex-верстки.
 */
export default function DebtsChats() {
  return (
    <section id="debts-chat" className="dc section">
      <div className="container dc__container">
        {/* Верхний блок-утверждение */}
        <figure className="dc__bubble dc__bubble--lg dc__bubble--center">
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
              />
            </div>
          </div>
        </figure>

        {/* Нижняя строка: вопрос + ответ */}
        <div className="dc__row">
          {/* Вопрос — аватар слева */}
          <figure className="dc__bubble dc__bubble--md dc__bubble--left">
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

          {/* Ответ — аватар справа */}
          <figure className="dc__bubble dc__bubble--md dc__bubble--right">
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