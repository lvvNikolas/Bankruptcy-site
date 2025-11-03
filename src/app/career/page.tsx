import type { Metadata } from "next";
import Link from "next/link";
import "@styles/CareerPage.css";

// SEO — серверный компонент, без "use client"
export const metadata: Metadata = {
  title: "Вакансии — Карьера",
  description:
    "Актуальные вакансии: юристы, помощники арбитражного управляющего и другие роли. Присоединяйтесь к сильной команде.",
  openGraph: {
    title: "Вакансии — Карьера",
    description:
      "Актуальные вакансии: юристы, помощники арбитражного управляющего и другие роли.",
    type: "website",
  },
};

// ⚠️ Проверь путь, если у тебя другая структура
import Footer from "@/app/components/sections/Footer/Footer";

type Vacancy = {
  title: string;
  excerpt: string;
  date: string; // ISO или читабельная дата
  href: string;
};

const VACANCIES: Vacancy[] = [
  {
    title: "Команде нужен арбитражный управляющий",
    excerpt:
      "В портфеле команды более 100 успешных дел по банкротству физлиц. Задачи: вести дела, контролировать работу помощников, проверять процессуальные документы.",
    date: "2023-01-29",
    href: "/career/au-manager",
  },
  {
    title: "Команде нужен помощник арбитражного управляющего",
    excerpt:
      "Опыт работы от 3 лет. Задачи: консультирование клиентов, процессуальные документы, представительство интересов в арбитражах.",
    date: "2023-01-26",
    href: "/career/au-assistant",
  },
  {
    title: "Команде нужен грамотный юрист",
    excerpt:
      "Представительство интересов в судах, составление договоров и соглашений, систематизация договорной базы компании.",
    date: "2023-01-09",
    href: "/career/lawyer",
  },
];

function formatDate(d: string) {
  try {
    const date = new Date(d);
    return date.toLocaleDateString("ru-RU");
  } catch {
    return d;
  }
}

export default function CareerPage() {
  return (
    <>
      {/* HERO */}
      <header className="career-hero" aria-labelledby="career-title">
        <div className="container">
          <nav className="career-crumbs" aria-label="Хлебные крошки">
            <ol>
              <li><Link href="/">Главная</Link></li>
              <li aria-current="page">Вакансии</li>
            </ol>
          </nav>

          <h1 id="career-title" className="career-hero__title">
            Вакансии
          </h1>
          <p className="career-hero__lead">
            Сильная команда и понятные задачи. Если хотите развиваться в
            банкротстве и защищать интересы клиентов — мы будем рады знакомству.
          </p>
        </div>
      </header>

      {/* LIST */}
      <main className="career">
        <div className="container">
          <ul className="career-grid" aria-label="Список вакансий">
            {VACANCIES.map((v) => (
              <li key={v.href} className="vacancy">
                <div className="vacancy__content">
                  <h2 className="vacancy__title">{v.title}</h2>
                  <p className="vacancy__excerpt">{v.excerpt}</p>
                  <div className="vacancy__meta">
                    <span className="vacancy__date">
                      Опубликовано: {formatDate(v.date)}
                    </span>
                  </div>
                </div>

                <div className="vacancy__actions">
                  <Link href={v.href} className="btn btn-outline vacancy__btn" aria-label={`Подробнее: ${v.title}`}>
                    Подробнее
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M5 12h12m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* ЕДИНСТВЕННЫЙ футер */}
      <Footer />
    </>
  );
}