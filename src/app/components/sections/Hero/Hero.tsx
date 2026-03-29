"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeroPromoForm from "@/app/components/LeadForm/HeroPromoForm";
import "@styles/Hero.css";

function useCountUp(target: number, duration: number, started: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let rafId: number;
    let startTs: number | null = null;
    rafId = requestAnimationFrame(function tick(ts) {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) rafId = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);
  return val;
}

export default function Hero() {
  const trustRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = trustRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c500 = useCountUp(500, 1400, started);
  const c98  = useCountUp(98,  1200, started);
  const c7   = useCountUp(7,   900,  started);

  return (
    <section id="hero" className="hero" aria-label="Главный блок">
      {/* Фон: видео (desktop) / картинка (mobile) */}
      <div className="hero__bg" aria-hidden="true">
        <video
          className="hero__video"
          src="/media/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/femida.png"
        />
        <div className="hero__mobileBg">
          <Image
            src="/media/femida.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__mobileBgImg"
          />
        </div>
        <div className="hero__bgOverlay" />
      </div>

      {/* Контент */}
      <div className="container hero__inner">
        <div className="hero__grid">

          {/* Левая колонка */}
          <div className="hero__left">
            <p className="hero__company">Юридическая компания Солюшен</p>
            <span className="hero__eyebrow">Банкротство физических лиц · 127-ФЗ</span>

            <h1 className="hero__title">
              Списание долгов{" "}
              <em className="hero__accent">законно</em>{" "}
              и безопасно
            </h1>

            <p className="hero__lead">
              Бесплатно оценим вашу ситуацию, подскажем оптимальный путь
              и рассчитаем сроки. Работаем по всей России.
            </p>

            <ul className="hero__bullets">
              <li>Бесплатная консультация юриста</li>
              <li>Сопровождение до решения суда</li>
              <li>Сохранность имущества по договору</li>
            </ul>

            <div className="hero__actions">
              <a href="#zayavka" className="hero__btn">
                Бесплатная консультация
              </a>
              <a href="#quiz" className="hero__btn hero__btn--ghost">
                Узнать стоимость
              </a>
            </div>

            <div className="hero__trust" ref={trustRef}>
              <div className="hero__trust-item">
                <span className="hero__trust-num">{started ? `${c500}+` : "500+"}</span>
                <span className="hero__trust-label">клиентов</span>
              </div>
              <div className="hero__trust-sep" aria-hidden="true" />
              <div className="hero__trust-item">
                <span className="hero__trust-num">{started ? `${c98}%` : "98%"}</span>
                <span className="hero__trust-label">списали долги</span>
              </div>
              <div className="hero__trust-sep" aria-hidden="true" />
              <div className="hero__trust-item">
                <span className="hero__trust-num">{started ? `${c7} лет` : "7 лет"}</span>
                <span className="hero__trust-label">на рынке</span>
              </div>
            </div>
          </div>

          {/* Правая колонка — форма */}
          <div className="hero__right" id="zayavka" aria-label="Форма заявки">
            <div className="hero__card">
              <div className="hero__cardHead">
                <div className="hero__chip">
                  <span className="hero__chip-dot" aria-hidden="true" />
                  Бесплатная консультация
                </div>
                <p className="hero__cardSub">Ответим в течение 10 минут</p>
              </div>

              <HeroPromoForm />

              <div className="hero__secure">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13" fill="currentColor">
                  <path d="M12 2 4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5L12 2Z" />
                </svg>
                Данные защищены · соответствует 152-ФЗ
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Хинт прокрутки */}
      <a
        href="#debts"
        className="hero__scroll"
        aria-label="Прокрутить к следующему блоку"
      >
        <span className="hero__dot" />
        Прокрутите вниз
      </a>
    </section>
  );
}