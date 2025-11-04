"use client";

import { useState } from "react";
import "@styles/ContactsPage.css";
import LeadForm from "@/app/components/LeadForm/LeadForm";

export default function ContactsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="contacts">
      <div className="container contacts__inner">
        {/* HERO */}
        <header className="contacts__hero">
          <p className="contacts__kicker">Контакты</p>
          <h1 className="contacts__title">
            Всегда на связи, чтобы помочь
            <br />
            со списанием долгов
          </h1>
          <p className="contacts__lead">
            Позвоните, напишите или приезжайте в офис. Подберём решение под вашу
            ситуацию и расскажем, как законно списать долги по&nbsp;127-ФЗ.
          </p>
        </header>

        {/* СЕТКА КАРТОЧЕК */}
        <section className="contacts__grid" aria-label="Способы связи">
          {/* Телефон */}
          <article className="contactsCard">
            <div className="contactsCard__icon contactsCard__icon--phone" />
            <h2 className="contactsCard__title">Позвоните нам</h2>
            <p className="contactsCard__note">
              Бесплатная консультация по телефону
            </p>

            <a className="contactsCard__value" href="tel:+79324990000">
              +7&nbsp;(932)&nbsp;499-00-00
            </a>

            {/* КНОПКА — открывает форму */}
            <button
              type="button"
              className="btn btn-primary contactsCard__btn"
              onClick={() => setIsOpen(true)}
            >
              Быстрая консультация
            </button>
          </article>

          {/* Почта */}
          <article className="contactsCard">
            <div className="contactsCard__icon contactsCard__icon--mail" />
            <h2 className="contactsCard__title">Напишите на почту</h2>
            <p className="contactsCard__note">Отвечаем в течение рабочего дня</p>

            <a className="contactsCard__value" href="mailto:info@donulya.ru">
              info@donulya.ru
            </a>
          </article>

          {/* Офис */}
          <article className="contactsCard">
            <div className="contactsCard__icon contactsCard__icon--pin" />
            <h2 className="contactsCard__title">Приезжайте в офис</h2>
            <p className="contactsCard__note">Личные консультации по записи</p>

            <div className="contactsCard__value">
              Державинский переулок, 5, 4&nbsp;этаж, офис&nbsp;401
            </div>
          </article>
        </section>
      </div>

      {/* === МОДАЛЬНОЕ ОКНО LeadForm === */}
      {isOpen && (
        <div className="contactsModal" role="dialog" aria-modal="true">
          <div className="contactsModal__backdrop" onClick={() => setIsOpen(false)} />
          <div className="contactsModal__window">
            <button
              className="contactsModal__close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть форму"
            >
              ×
            </button>
            <LeadForm />
          </div>
        </div>
      )}
    </main>
  );
}