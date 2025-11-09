"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import "@styles/Results.css";

/** Хук плавного счёта от 0 до target за duration мс */
function useCountUp(shouldRun: boolean, target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldRun) return;

    const animate = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out
      setValue(Math.round(target * eased));

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [shouldRun, target, duration]);

  return value;
}

/** Одна карточка банка */
function ResultCard({
  index,
  name,
  img,
  amount,
  unit,
}: {
  index: number;
  name: string;
  img: string;
  amount: number;
  unit: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // следим за вхождением карточки в зону видимости
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);      // запускаем счёт один раз
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const current = useCountUp(visible, amount, 1400);
  const formatted = new Intl.NumberFormat("ru-RU").format(current);

  return (
    <article
      ref={cardRef}
      className="results__card"
      data-index={index}
    >
      <h3 className="results__bank">{name}</h3>

      <div className="results__logo">
        <Image src={img} alt={name} width={100} height={100} />
      </div>

      <p className="results__label">Списали более</p>

      <div className="results__amount">
        <span className="results__amountNum">{formatted}</span>
        <span className="results__amountUnit">{unit}</span>
      </div>
    </article>
  );
}

export default function Results() {
  const banks = useMemo(
    () => [
      { name: "СберБанк", img: "/media/sber.png", amount: 428, unit: "млн ₽" },
      { name: "Альфа-Банк", img: "/media/alfa.png", amount: 173, unit: "млн ₽" },
      { name: "Тинькофф", img: "/media/t.png", amount: 294, unit: "млн ₽" },
      { name: "ВТБ", img: "/media/vtb.png", amount: 307, unit: "млн ₽" },
    ],
    []
  );

  return (
    <section
      id="results"
      className="results section"
      aria-labelledby="results-title"
    >
      <div className="container">
        <header className="results__head">
          <p className="results__eyebrow">Результаты нашей работы</p>

          <h2 id="results-title" className="results__title">
            Мы помогли более{" "}
            <span className="results__accent">3&nbsp;000 клиентам</span>
            <br />
            списать свыше{" "}
            <span className="results__accent">1&nbsp;млрд&nbsp;рублей</span>
          </h2>

          <p className="results__subtitle">
            Ниже лишь малая часть банков, по которым мы добились реального
            списания задолженности в рамках процедуры банкротства.
          </p>
        </header>

        <div className="results__grid">
          {banks.map((b, i) => (
            <ResultCard
              key={b.name}
              index={i}
              name={b.name}
              img={b.img}
              amount={b.amount}
              unit={b.unit}
            />
          ))}
        </div>
      </div>
    </section>
  );
}