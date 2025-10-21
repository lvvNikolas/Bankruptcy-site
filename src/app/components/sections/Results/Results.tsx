"use client";

import Image from "next/image";
import "@styles/Results.css";

export default function Results() {
  const banks = [
    {
      name: "СберБанк",
      img: "/Media/sber.png",
      amount: "428 млн. руб",
    },
    {
      name: "Альфа-Банк",
      img: "/Media/alfa.png",
      amount: "173 млн. руб",
    },
    {
      name: "Тинькофф",
      img: "/Media/t.png",
      amount: "294 млн. руб",
    },
    {
      name: "ВТБ",
      img: "/Media/vtb.png",
      amount: "307 млн. руб",
    },
  ];

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
            <article key={i} className="results-card">
              <h3 className="results-bank">{b.name}</h3>
              <div className="results-logo">
                <Image src={b.img} alt={b.name} width={100} height={100} />
              </div>
              <p className="results-label">Списали более</p>
              <div className="results-amount">{b.amount}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}