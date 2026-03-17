import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/app/components/LeadForm/LeadForm";
import "@styles/LoyaltyPage.css";

export const metadata: Metadata = {
  alternates: { canonical: "/programma-loyalnosti" },
  title: "Программа лояльности — 20 000 ₽ за приведённого клиента",
  description:
    "Приведите знакомого с долгами — получите 20 000 ₽ после заключения договора. Простая партнёрская программа без лимитов и скрытых условий.",
  openGraph: {
    title: "Программа лояльности — 20 000 ₽ за клиента | Юридическое агентство по банкротству Солюшен",
    description:
      "Порекомендуйте нас знакомому с долгами и получите 20 000 ₽ вознаграждения. Без сложных схем — только честное партнёрство.",
    type: "website",
  },
};

const SITE_URL = "https://basolution.ru";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Программа лояльности",
      item: `${SITE_URL}/programma-loyalnosti/`,
    },
  ],
};

const STEPS = [
  {
    num: "01",
    title: "Порекомендуйте нас",
    desc: "Расскажите знакомому с долгами о нашей компании. Когда он позвонит нам — пусть назовёт ваше имя и фамилию. Это и есть ваш личный промокод.",
  },
  {
    num: "02",
    title: "Клиент подписывает договор",
    desc: "Мы проводим бесплатную консультацию и при необходимости заключаем договор. Ваш знакомый получает профессиональную юридическую защиту.",
  },
  {
    num: "03",
    title: "Вы получаете 20 000 ₽",
    desc: "После внесения клиентом первого платежа по договору мы переводим вам вознаграждение — на карту или наличными в течение 3 рабочих дней.",
  },
];

const REASONS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Бесплатная консультация",
    desc: "Первый шаг для вашего знакомого — бесплатно. Никаких трат только за разговор с нашим юристом.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Более 500 успешных дел",
    desc: "Реальные кейсы со списанными долгами. Клиенты остаются довольны и сами рекомендуют нас дальше.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Прозрачные условия",
    desc: "Фиксированная стоимость, договор на руках у клиента с первого дня. Никаких сюрпризов.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Быстрая выплата",
    desc: "Переводим деньги в течение 3 рабочих дней после первого платежа клиента. Удобным для вас способом.",
  },
];

const EARNINGS = [
  { clients: "1 клиент", amount: "20 000 ₽" },
  { clients: "3 клиента", amount: "60 000 ₽" },
  { clients: "5 клиентов", amount: "100 000 ₽" },
  { clients: "10 клиентов", amount: "200 000 ₽", accent: true },
];

export default function LoyaltyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        {/* ===== HERO ===== */}
        <header className="lp-hero">
          <div className="container">
            <nav className="lp-crumbs" aria-label="Хлебные крошки">
              <ol>
                <li>
                  <Link href="/">Главная</Link>
                </li>
                <li aria-current="page">Программа лояльности</li>
              </ol>
            </nav>

            <p className="lp-hero__badge">Партнёрская программа</p>

            <h1 className="lp-hero__title">
              Зарабатывайте{" "}
              <span className="lp-hero__accent">20 000 ₽</span>
              <br />
              за каждого приведённого клиента
            </h1>

            <p className="lp-hero__sub">
              Порекомендуйте нас знакомому с долгами — получите вознаграждение
              после заключения договора. Без сложных схем, только честное партнёрство.
            </p>

            <div className="lp-hero__stats">
              <div className="lp-stat">
                <span className="lp-stat__num">20 000 ₽</span>
                <span className="lp-stat__label">за каждого клиента</span>
              </div>
              <div className="lp-stat__divider" aria-hidden="true" />
              <div className="lp-stat">
                <span className="lp-stat__num">3 дня</span>
                <span className="lp-stat__label">срок выплаты</span>
              </div>
              <div className="lp-stat__divider" aria-hidden="true" />
              <div className="lp-stat">
                <span className="lp-stat__num">∞</span>
                <span className="lp-stat__label">без лимита рефералов</span>
              </div>
            </div>
          </div>
        </header>

        {/* ===== STEPS ===== */}
        <section className="lp-steps" aria-labelledby="lp-steps-title">
          <div className="container">
            <h2 id="lp-steps-title" className="lp-section-title">
              Как это работает
            </h2>
            <p className="lp-section-sub">Три простых шага — и деньги у вас</p>

            <ol className="lp-steps__list">
              {STEPS.map((step) => (
                <li key={step.num} className="lp-step">
                  <span className="lp-step__num" aria-hidden="true">
                    {step.num}
                  </span>
                  <h3 className="lp-step__title">{step.title}</h3>
                  <p className="lp-step__desc">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== WHY RECOMMEND ===== */}
        <section className="lp-reasons" aria-labelledby="lp-reasons-title">
          <div className="container">
            <h2 id="lp-reasons-title" className="lp-section-title lp-section-title--light">
              Почему нас легко рекомендовать
            </h2>
            <p className="lp-section-sub lp-section-sub--light">
              Ваша репутация — в надёжных руках
            </p>

            <div className="lp-reasons__grid">
              {REASONS.map((r) => (
                <article key={r.title} className="lp-reason">
                  <div className="lp-reason__icon">{r.icon}</div>
                  <h3 className="lp-reason__title">{r.title}</h3>
                  <p className="lp-reason__desc">{r.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== EARNINGS ===== */}
        <section className="lp-earn" aria-labelledby="lp-earn-title">
          <div className="container">
            <h2 id="lp-earn-title" className="lp-section-title">
              Сколько можно заработать
            </h2>
            <p className="lp-section-sub">
              Количество рекомендаций не ограничено — зарабатывайте столько, сколько хотите
            </p>

            <div className="lp-earn__wrap">
              <table className="lp-earn__table">
                <thead>
                  <tr>
                    <th scope="col">Количество клиентов</th>
                    <th scope="col">Ваш доход</th>
                  </tr>
                </thead>
                <tbody>
                  {EARNINGS.map((row) => (
                    <tr key={row.clients} className={row.accent ? "lp-earn__row--accent" : ""}>
                      <td>{row.clients}</td>
                      <td>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="lp-earn__note">
                <p>
                  💡 <strong>Совет:</strong> поделитесь этой страницей в социальных сетях —
                  среди ваших подписчиков точно найдутся люди с долговыми проблемами.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="lp-cta" aria-labelledby="lp-cta-title">
          <div className="container">
            <div className="lp-cta__inner">
              <div className="lp-cta__text">
                <h2 id="lp-cta-title" className="lp-cta__title">
                  Начните зарабатывать прямо сейчас
                </h2>
                <p className="lp-cta__sub">
                  Оставьте заявку — мы свяжемся с вами, расскажем все детали
                  и зарегистрируем в программе. Бесплатно и без обязательств.
                </p>
                <ul className="lp-cta__list">
                  <li>Ваш промокод — ваше имя и фамилия</li>
                  <li>Выплата на карту или наличными</li>
                  <li>Неограниченное количество рефералов</li>
                  <li>Первая выплата — уже через 3 дня</li>
                </ul>
                <a href="tel:+79162979645" className="lp-cta__phone">
                  +7 (916) 297-96-45
                </a>
              </div>

              <div className="lp-cta__form-wrap">
                <p className="lp-cta__form-title">Хочу стать партнёром</p>
                <LeadForm
                  context="loyalty"
                  formId="loyalty_form"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
