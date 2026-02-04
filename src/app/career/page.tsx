import type { Metadata, Route } from "next";
import Link from "next/link";
import "@styles/CareerPage.css";

export const metadata: Metadata = {
  title: "Карьера — открытые вакансии",
  description:
    "Открытые вакансии компании: юристы, арбитражные управляющие, помощники. Присоединяйтесь к профессиональной команде.",
};

type Vacancy = {
  id: string;
  href: Route;
  title: string;
  intro: string;
  date: string;
};

const VACANCIES: Vacancy[] = [
  {
    id: "v1",
    href: "/career",
    title: "Арбитражный управляющий",
    intro:
      "Ищем в команду опытного арбитражного управляющего с портфолио успешных дел. Задача — контроль помощников и ведение процедур банкротства физлиц.",
    date: "29.01.2023",
  },
  {
    id: "v2",
    href: "/career",
    title: "Помощник арбитражного управляющего",
    intro:
      "Требуется помощник с опытом от 3 лет. Консультирование клиентов, подготовка документов и сопровождение судебных заседаний.",
    date: "26.01.2023",
  },
  {
    id: "v3",
    href: "/career",
    title: "Юрист по банкротству физических лиц",
    intro:
      "Ищем грамотного юриста, готового представлять интересы клиентов в судах, готовить договоры и контролировать юридические процессы компании.",
    date: "09.01.2023",
  },
];

export default function CareerPage() {
  return (
    <main>
      {/* HERO */}
      <header className="career-hero" aria-labelledby="career-title">
        <div className="container">
          <nav className="career-crumbs" aria-label="Хлебные крошки">
            <ol>
              <li>
                <Link href="/">Главная</Link>
              </li>
              <li aria-current="page">Карьера</li>
            </ol>
          </nav>

          <h1 id="career-title" className="career-title">
            Вакансии
          </h1>
          <p className="career-lead">
            Мы растём и расширяем команду. Присоединяйтесь к юристам и
            арбитражным управляющим, которые ежедневно помогают клиентам
            законно списывать долги и защищать имущество.
          </p>
        </div>
      </header>

      {/* VACANCIES */}
      <section className="career-section">
        <div className="container">
          <ul className="career-grid">
            {VACANCIES.map((v) => (
              <li key={v.id} className="vacancy-card">
                <div className="vacancy-info">
                  <h2 className="vacancy-title">{v.title}</h2>
                  <p className="vacancy-intro">{v.intro}</p>
                  <p className="vacancy-date">
                    Опубликовано: <time dateTime="2023-01-29">{v.date}</time>
                  </p>
                </div>

                <Link
                  href={v.href}
                  className="vacancy-btn"
                  prefetch={false}
                  aria-label={`Подробнее о вакансии: ${v.title}`}
                >
                  Подробнее
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="vacancy-icon"
                  >
                    <path
                      d="M5 12h12m-5-5 5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <div className="career-note">
            Не нашли подходящую вакансию? Напишите нам на&nbsp;
            <a href="mailto:hr@orlovskyandco.ru">bankruptcyagencysolution@yandex.com</a> — мы
            свяжемся, когда появится подходящая позиция.
          </div>
        </div>
      </section>
    </main>
  );
}