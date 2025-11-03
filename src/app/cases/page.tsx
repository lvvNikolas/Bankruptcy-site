import Link from "next/link";
import type { Metadata } from "next";

import "@styles/CasesPage.css";

/** SEO (страница — server component, без `use client`) */
export const metadata: Metadata = {
  title: "Выигранные дела",
  description:
    "Реальные успешно завершённые дела по списанию долгов и защите интересов клиентов.",
  openGraph: {
    title: "Выигранные дела",
    description:
      "Реальные успешно завершённые дела по списанию долгов и защите интересов клиентов.",
    type: "website",
  },
};

/** Секции (пути оставлены твоими) */
import CasesSection from "@/app/components/sections/Cases/CasesSection";
import Quiz from "@/app/components/sections/Quiz/Quiz";
// ⚠️ Footer НЕ подключаем здесь, чтобы не было дубля,
// если он уже рендерится в app/layout.tsx

export default function CasesPage() {
  return (
    <>
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