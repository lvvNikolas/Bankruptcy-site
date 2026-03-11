"use client";

import { useState } from "react";
import Link from "next/link";
import "@styles/CalcPreview.css";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export default function CalcPreview() {
  const [debt, setDebt] = useState(1_000_000);

  const stateFees = 45_000;
  const lawyer = Math.min(80_000 + Math.floor((debt - 300_000) / 100_000) * 3_000, 160_000);
  const totalCost = stateFees + lawyer;
  const savings = Math.max(0, debt * 1.25 * 3 - totalCost);
  const pct = ((debt - 300_000) / (10_000_000 - 300_000)) * 100;

  return (
    <section className="cp">
      <div className="container cp__inner">

        {/* Left: text */}
        <div className="cp__left">
          <span className="cp__eyebrow">Бесплатный инструмент</span>
          <h2 className="cp__title">
            Узнайте стоимость<br />
            банкротства за 30 секунд
          </h2>
          <p className="cp__desc">
            Введите сумму долга — и калькулятор покажет ориентировочную
            стоимость процедуры, срок и сколько вы сэкономите по сравнению
            с продолжением выплат.
          </p>

          <ul className="cp__list" aria-label="Что показывает калькулятор">
            <li>Стоимость под ключ (госпошлина + юрист)</li>
            <li>Срок процедуры в месяцах</li>
            <li>Экономия vs. выплаты по долгу</li>
          </ul>
        </div>

        {/* Right: mini calculator */}
        <div className="cp__card">
          <div className="cp__card-head">
            <span className="cp__card-label">Сумма долга</span>
            <span className="cp__card-val">{fmt(debt)}</span>
          </div>

          <input
            type="range"
            className="cp__range"
            min={300_000}
            max={10_000_000}
            step={50_000}
            value={debt}
            onChange={(e) => setDebt(Number(e.target.value))}
            aria-label="Сумма долга"
            style={{
              background: `linear-gradient(90deg, #d1a24c ${pct}%, rgba(255,255,255,0.15) 0%)`,
            }}
          />

          <div className="cp__ticks">
            <span>300 000 ₽</span>
            <span>10 000 000 ₽</span>
          </div>

          <div className="cp__metrics">
            <div className="cp__metric">
              <span className="cp__metric-label">Стоимость процедуры</span>
              <span className="cp__metric-val">{fmt(totalCost)}</span>
            </div>
            <div className="cp__metric">
              <span className="cp__metric-label">Ваша экономия</span>
              <span className="cp__metric-val cp__metric-val--gold">{fmt(Math.round(savings / 10_000) * 10_000)}</span>
            </div>
          </div>

          <Link href="/calculator" className="cp__btn">
            Рассчитать подробнее →
          </Link>
          <p className="cp__note">Расчёт ориентировочный. Консультация бесплатна.</p>
        </div>

      </div>
    </section>
  );
}