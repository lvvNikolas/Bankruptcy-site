"use client";

import { useId } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import "@styles/hero-promo.css";

export default function HeroPromoForm() {
  const phoneId = useId();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: отправка формы
  };

  return (
    <section className="promoWrap" aria-label="Промо-консультация">
      <div className="promoCard">
        {/* Заголовок */}
        <h3 className="promoTitle">
          Консультация с юристом
          <br />по теме списания долгов
        </h3>

        {/* Стоимость/скидка */}
        <div className="promoPriceRow" role="group" aria-label="Стоимость услуги">
          <div className="promoPriceNow">
            <div className="promoPriceNowValue">0&nbsp;руб</div>
          </div>
          <div className="promoPriceWas">
            <div className="promoPriceWasLabel">Вместо</div>
            <div className="promoPriceWasValue" aria-label="Старая цена">
              <s>1&nbsp;900&nbsp;руб</s>
            </div>
          </div>
        </div>

        {/* Форма */}
        <form className="promoForm" onSubmit={onSubmit} noValidate>
          <label htmlFor={phoneId} className="promoField">
            <input
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Ваш телефон для связи"
              required
            />
            <button
              type="button"
              className="promoPhoneBtn"
              aria-label="Мы перезвоним"
              tabIndex={-1}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.85 21 3 13.15 3 3c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2Z"
                />
              </svg>
            </button>
          </label>

          <button type="submit" className="promoBtn">
            <span className="promoBtnIco" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6.4 12.8 2 11l20-9-9 20-1.8-4.4-4.8-4.8Z"
                />
              </svg>
            </span>
            БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ
          </button>

          <p className="promoNote">
            Отправляя форму вы даёте{" "}
            <Link
              href={{ pathname: "/policy" }}
              className="promoLink"
              prefetch={false}
            >
              согласие
            </Link>{" "}
            на обработку личных данных —{" "}
            <Link
              href={{ pathname: "/policy" }}
              className="promoLink"
              prefetch={false}
            >
              Политика обработки персональных данных
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}