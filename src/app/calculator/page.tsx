"use client";

import { useState } from "react";
import Link from "next/link";
import "@styles/CalculatorPage.css";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function calcResults(debt: number, creditors: number, hasProperty: boolean) {
  // Cost estimation
  const stateFees = 45_000;
  const lawyerBase = 80_000;
  const lawyerExtra = Math.min(Math.floor((debt - 300_000) / 100_000) * 3_000, 80_000);
  const totalCost = stateFees + lawyerBase + lawyerExtra;

  // Duration
  const durationMin = hasProperty ? 10 : 8;
  const durationMax = hasProperty ? 16 : 12;
  const duration = `${durationMin}–${durationMax} месяцев`;

  // What client would pay without bankruptcy (3 years at 25% annual)
  const yearsOfPayment = 3;
  const annualRate = 0.25 + Math.min(creditors * 0.01, 0.1);
  const totalWithoutBankruptcy = debt * (1 + annualRate * yearsOfPayment);

  // Savings
  const savings = Math.max(0, totalWithoutBankruptcy - totalCost);

  return { totalCost, duration, savings, totalWithoutBankruptcy };
}

export default function CalculatorPage() {
  const [debt, setDebt] = useState(800_000);
  const [creditors, setCreditors] = useState(3);
  const [hasProperty, setHasProperty] = useState(false);

  const { totalCost, duration, savings } = calcResults(debt, creditors, hasProperty);

  return (
    <>
      <header className="calc-hero">
        <div className="container">
          <nav aria-label="Хлебные крошки" style={{ marginBottom: 14, fontSize: "0.85rem", color: "#9ca3af" }}>
            <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Главная</Link>
            {" › "}
            <span>Калькулятор</span>
          </nav>
          <div className="calc-hero__badge">Бесплатно</div>
          <h1 className="calc-hero__title">Калькулятор банкротства</h1>
          <p className="calc-hero__sub">
            Введите параметры и узнайте ориентировочную стоимость процедуры,
            срок и выгоду по сравнению с продолжением выплат.
          </p>
        </div>
      </header>

      <section className="calc-section">
        <div className="container">
          <div className="calc-grid">

            {/* ===== Form ===== */}
            <div className="calc-form">
              <h2 className="calc-form__title">Параметры вашей ситуации</h2>

              <div className="calc-field">
                <div className="calc-label">
                  <span>Сумма долга</span>
                  <span className="calc-label__val">{fmt(debt)}</span>
                </div>
                <input
                  type="range"
                  className="calc-range"
                  min={300_000}
                  max={10_000_000}
                  step={50_000}
                  value={debt}
                  onChange={(e) => setDebt(Number(e.target.value))}
                  aria-label="Сумма долга"
                  style={{
                    background: `linear-gradient(90deg, #d1a24c ${((debt - 300_000) / (10_000_000 - 300_000)) * 100}%, #e8edf5 0%)`
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af", marginTop: 4 }}>
                  <span>300 000 ₽</span>
                  <span>10 000 000 ₽</span>
                </div>
              </div>

              <div className="calc-field">
                <div className="calc-label">
                  <span>Количество кредиторов</span>
                  <span className="calc-label__val">{creditors}</span>
                </div>
                <input
                  type="range"
                  className="calc-range"
                  min={1}
                  max={20}
                  step={1}
                  value={creditors}
                  onChange={(e) => setCreditors(Number(e.target.value))}
                  aria-label="Количество кредиторов"
                  style={{
                    background: `linear-gradient(90deg, #d1a24c ${((creditors - 1) / 19) * 100}%, #e8edf5 0%)`
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af", marginTop: 4 }}>
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              <div className="calc-field">
                <div className="calc-label">
                  <span>Есть движимое имущество?</span>
                </div>
                <div className="calc-radio-group" role="radiogroup" aria-label="Наличие имущества">
                  <label className={`calc-radio ${!hasProperty ? "calc-radio--active" : ""}`}>
                    <input
                      type="radio"
                      name="property"
                      checked={!hasProperty}
                      onChange={() => setHasProperty(false)}
                    />
                    Нет
                  </label>
                  <label className={`calc-radio ${hasProperty ? "calc-radio--active" : ""}`}>
                    <input
                      type="radio"
                      name="property"
                      checked={hasProperty}
                      onChange={() => setHasProperty(true)}
                    />
                    Да (авто, дача)
                  </label>
                </div>
              </div>
            </div>

            {/* ===== Result ===== */}
            <div className="calc-result">
              <h2 className="calc-result__title">Результат расчёта</h2>

              <div className="calc-metric">
                <div className="calc-metric__label">Ориентировочная стоимость</div>
                <div className="calc-metric__value">{fmt(totalCost)}</div>
                <div className="calc-metric__sub">включая госпошлину и сопровождение</div>
              </div>

              <div className="calc-metric">
                <div className="calc-metric__label">Срок процедуры</div>
                <div className="calc-metric__value">{duration}</div>
                <div className="calc-metric__sub">с момента подачи заявления в суд</div>
              </div>

              <div className="calc-divider" />

              <div className="calc-saving">
                <div className="calc-saving__label">Ваша экономия</div>
                <div className="calc-saving__value">{fmt(Math.round(savings / 1000) * 1000)}</div>
                <div className="calc-saving__note">по сравнению с выплатами по долгу за 3 года</div>
              </div>

              <Link href="/contacts" className="calc-cta-btn">
                Получить точный расчёт бесплатно
              </Link>
              <p className="calc-cta-note">Звонок и консультация — бесплатно</p>
            </div>

            <p className="calc-disclaimer">
              ⚠️ Данные рассчитаны приблизительно и носят ознакомительный характер.
              Точная стоимость зависит от сложности дела, региона и объёма документов.
              Получите бесплатную консультацию юриста для точной оценки вашей ситуации.
            </p>

          </div>
        </div>
      </section>
    </>
  );
}