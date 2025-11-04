"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import "@styles/Navbar.css";

/** Ссылки меню */
const LINKS: ReadonlyArray<{ href: Route; label: string }> = [
  { href: "/" as Route, label: "Главная" },
  { href: "/uslugi" as Route, label: "Услуги" },
  { href: "/cases" as Route, label: "Выигранные дела" },
  { href: "/faq" as Route, label: "Вопросы и ответы" },
  { href: "/career" as Route, label: "Карьера" },
  { href: "/contacts" as Route, label: "Контакты" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Закрываем меню при ресайзе, чтобы не залипало
  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* ЛОГО слева */}
        <Link
          href={"/" as Route}
          className="nav__logo"
          aria-label="На главную"
          prefetch={false}
        >
          <span />
        </Link>

        {/* Десктоп-меню по центру */}
        <nav className="nav__desk" aria-label="Основное меню">
          <ul className="nav__list" role="list">
            {LINKS.map((l) => (
              <li key={l.href} className="nav__item">
                <Link href={l.href} className="nav__link" prefetch={false}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Бургер справа (виден только на мобилке) */}
        <button
          type="button"
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Мобильный оверлей */}
      {open && (
        <div className="nav__drop" role="dialog" aria-modal="true">
          {/* Крестик внутри оверлея */}
          <button
            type="button"
            className="nav__close"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          >
            <span />
          </button>

          <ul className="nav__mList" role="list">
            {LINKS.map((l) => (
              <li key={`m-${l.href}`} className="nav__mItem">
                <Link
                  href={l.href}
                  className="nav__mLink"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}