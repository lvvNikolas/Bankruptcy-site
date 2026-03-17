import Link from "next/link";
import type { Metadata } from "next";

import "@styles/CasesPage.css";

/** SEO (страница — server component, без `use client`) */
export const metadata: Metadata = {
  alternates: { canonical: "/cases" },
  title: "Выигранные дела",
  description:
    "Реальные успешно завершённые дела по списанию долгов и защите интересов клиентов.",
  openGraph: {
    title: "Выигранные дела | Юридическое агентство по банкротству Солюшен",
    description:
      "Реальные успешно завершённые дела по списанию долгов и защите интересов клиентов.",
    type: "website",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630 }],
  },
};

const SITE_URL = "https://basolution.ru";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Выигранные дела", item: `${SITE_URL}/cases/` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Выигранные дела Юридическое агентство по банкротству Солюшен",
    description: "Реальные кейсы по списанию долгов через банкротство физических лиц",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Максим Головко — списание 500 000 ₽ (Симферополь)",
        url: `${SITE_URL}/cases/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Виктор Дронов — списание 2 500 000 ₽ (Москва)",
        url: `${SITE_URL}/cases/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Валера Пименов — списание 1 500 000 ₽ (Санкт-Петербург)",
        url: `${SITE_URL}/cases/`,
      },
    ],
  },
];

/** Секции (пути оставлены твоими) */
import CasesSection from "@/app/components/sections/Cases/CasesSection";
import Quiz from "@/app/components/sections/Quiz/Quiz";
// ⚠️ Footer НЕ подключаем здесь, чтобы не было дубля,
// если он уже рендерится в app/layout.tsx

export default function CasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* HERO без изображения, чистый светлый блок */}
      <header className="cases-hero" aria-labelledby="cases-title">
        <div className="container">
          <nav className="cases-crumbs" aria-label="Хлебные крошки">
            <ol>
              <li>
                <Link href="/">Главная</Link>
              </li>
              <li aria-current="page">Выигранные дела</li>
            </ol>
          </nav>

          <h1 id="cases-title" className="cases-hero__title">
            Выигранные дела
          </h1>

          <p className="cases-hero__lead">
            Подборка кейсов, где мы защитили имущество клиентов, списали долги и
            довели дело до результата. Кратко, по делу и с понятными итогами.
          </p>
        </div>
      </header>

      {/* Секция кейсов */}
      <main>
        <section id="cases-list" className="container cases-section">
          <CasesSection />
        </section>

        {/* Квиз */}
        <section id="quiz" className="container quiz-section">
          <Quiz />
        </section>
      </main>
    </>
  );
}