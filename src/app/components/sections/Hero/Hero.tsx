"use client";

import HeroPromoForm from "@/app/components/LeadForm/HeroPromoForm";
import "@styles/hero.css";

export default function Hero() {
  return (
    <section id="hero" className="hero hero--split" aria-label="Главный блок">
      <div className="container hero-grid">
        {/* Левая колонка — слоган + подзаголовок + якорь к форме */}
        <div className="hero-text">
          <h1 className="hero-title">
            Списание долгов <span className="hero-accent">законно</span> и безопасно
          </h1>

          <p className="hero-lead">
            Законное избавление от долгов по 127-ФЗ. Консультация и анализ вашей ситуации —
            бесплатно.
          </p>

          <a className="hero-link" href="#zayavka">
            Перейти к форме <span className="hero-link-arr">↓</span>
          </a>
        </div>

        {/* Правая колонка — форма. Фикс. ширина, чтобы не «сжималась» контейнером */}
        <div className="hero-form" id="zayavka" aria-label="Форма заявки">
           <HeroPromoForm />
        </div>
      </div>

      <a href="#uslugi" className="hero-scrollHint" aria-label="Прокрутить к следующему блоку">
        <span className="hero-scrollDot" />
        Прокрутите вниз
      </a>
    </section>
  );
}