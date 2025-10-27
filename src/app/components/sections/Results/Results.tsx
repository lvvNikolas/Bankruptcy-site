"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import "@styles/Results.css";

/** Плавное увеличение значения от 0 до target за duration мс */
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

/** Отдельная карточка — тут можно безопасно вызывать хуки */
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
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Следим за видимостью конкретной карточки
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true); // запускаем анимацию один раз
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const counted = useCountUp(visible, amount, 1400);
  const formatted = new Intl.NumberFormat("ru-RU").format(counted);

  return (
    <article className="results-card" ref={ref} data-index={index}>
      <h3 className="results-bank">{name}</h3>

      <div className="results-logo">
        <Image src={img} alt={name} width={100} height={100} />
      </div>

      <p className="results-label">Списали более</p>

      <div className="results-amount">
        <span className="results-amountNum">{formatted}</span>{" "}
        <span className="results-amountUnit">{unit}</span>
      </div>
    </article>
  );
}

export default function Results() {
  const banks = useMemo(
    () => [
      { name: "СберБанк", img: "/media/sber.png", amount: 428, unit: "млн. руб" },
      { name: "Альфа-Банк", img: "/media/alfa.png", amount: 173, unit: "млн. руб" },
      { name: "Тинькофф", img: "/media/t.png", amount: 294, unit: "млн. руб" },
      { name: "ВТБ", img: "/media/vtb.png", amount: 307, unit: "млн. руб" },
    ],
    []
  );

  return (
    <section id="results" className="results section" aria-labelledby="results-title">
      <div className="container">
        <header className="results-head">
          <h2 id="results-title" className="results-title">
            Мы помогли <span className="results-accent">3 000 клиентам</span>
            <br />
            списать более <span className="results-accent">1 млрд рублей</span>
          </h2>
        </header>

        <div className="results-grid">
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