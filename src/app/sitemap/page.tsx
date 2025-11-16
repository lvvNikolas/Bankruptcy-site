import Link from "next/link";
import type { Metadata, Route } from "next";
import "@styles/SitemapPage.css";

type NavLink = {
  href: Route;
  label: string;
};

type Section = {
  title: string;
  links: NavLink[];
};

export const metadata: Metadata = {
  title: "Карта сайта — Компания",
  description: "Быстрый доступ ко всем разделам сайта Компания и Ко.",
};

const SECTIONS: Section[] = [
  {
    title: "Основные разделы",
    links: [
      { href: "/" as Route, label: "Главная" },
      { href: "/uslugi" as Route, label: "Услуги" },
      { href: "/cases" as Route, label: "Выигранные дела" },
      { href: "/faq" as Route, label: "Вопросы и ответы" },
      { href: "/career" as Route, label: "Карьера" },
      { href: "/contacts" as Route, label: "Контакты" },
    ],
  },
  {
    title: "Полезная информация",
    links: [
      // эти роуты тоже должны существовать в app/, иначе просто убери/переименуй
      { href: "/privacy-policy" as Route, label: "Политика конфиденциальности" },
      { href: "/terms-of-use" as Route, label: "Пользовательское соглашение" },
      { href: "/disclosures" as Route, label: "Раскрытия информации" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <section className="sitemap">
      <div className="container">
        <h1 className="sitemap__title">Карта сайта</h1>
        <p className="sitemap__desc">
          Быстрый доступ ко всем страницам сайта «Орловский и Ко».
        </p>

        <div className="sitemap__grid">
          {SECTIONS.map((section) => (
            <div key={section.title} className="sitemap__block">
              <h2 className="sitemap__heading">{section.title}</h2>
              <ul className="sitemap__list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}