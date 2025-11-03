"use client";

import HeroPromoForm from "@/app/components/LeadForm/HeroPromoForm";
import "@styles/hero.css";

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-label="Главный блок">
      {/* Декоративный фон */}
      <div className="hero__decor" aria-hidden="true">
        <div className="hero__blob hero__blob--gold" />
        <div className="hero__blob hero__blob--red" />
        <div className="hero__gridLines" />
      </div>

      <div className="container">
        <div className="hero__grid">
          {/* Левая колонка — текст */}
          <div className="hero__left">
            <h1 className="hero__title">
              Списание долгов{" "}
              <span className="hero__accent">законно</span> и безопасно
            </h1>

            <p className="hero__lead">
              Бесплатно оценим вашу ситуацию по 127-ФЗ, подскажем оптимальный путь
              и рассчитаем сроки и стоимость. Работаем по всей России.
            </p>

            <ul className="hero__bullets">
              <li><i aria-hidden>✓</i> Бесплатная консультация юриста</li>
              <li><i aria-hidden>✓</i> Сопровождение до решения суда</li>
              <li><i aria-hidden>✓</i> Сохранность имущества по договору</li>
            </ul>

            <div className="hero__actions">
              <a href="#zayavka" className="hero__btn">Бесплатная консультация</a>
              <a href="#quiz" className="hero__btn hero__btn--ghost">Узнать стоимость</a>
            </div>
          </div>

          {/* Правая колонка — форма (на мобилке окажется ниже по потоку) */}
          <div className="hero__right" id="zayavka" aria-label="Форма заявки">
            <div className="hero__card">
              <div className="hero__cardHead">
                <span className="hero__chip">Заявка за 1 минуту</span>
              </div>

              {/* Встроенная форма. Ниже в hero.css — принудительные «светлые» override’ы */}
              <HeroPromoForm />

              <p className="hero__foot">
                Отправляя форму, вы даёте{" "}
                <a href="/sogl">согласие</a> на обработку персональных данных.
              </p>
            </div>
          </div>
        </div>

        {/* Хинт прокрутки */}
        <a href="#uslugi" className="hero__scroll" aria-label="Прокрутить к следующему блоку">
          <span className="hero__dot" />
          Прокрутите вниз
        </a>
      </div>
    </section>
  );
}