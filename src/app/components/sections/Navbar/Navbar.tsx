"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@styles/Navbar.css";

/** Ссылки меню (без "Услуги") */
const LINKS = [
  { href: "/", label: "Главная" },
  { href: "/cases", label: "Выигранные дела" },
  { href: "/faq", label: "Вопросы и ответы" },
  { href: "/career", label: "Карьера" },
  { href: "/contacts", label: "Контакты" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Блокируем скролл страницы, когда меню открыто
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Логотип слева */}
        <Link href="/" className="nav__logo" aria-label="На главную">
          <Image
            src="/media/logo.png"
            alt="Логотип"
            width={42}
            height={42}
            priority
          />
        </Link>

        {/* Десктоп-меню по центру */}
        <nav className="nav__desk" aria-label="Основное меню">
          <ul className="nav__list" role="list">
            {LINKS.map((link) => (
              <li key={link.href} className="nav__item">
                <Link href={link.href} className="nav__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Бургер справа (мобилка) */}
        <button
          type="button"
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Мобильный оверлей */}
      {open && (
        <div
          className="nav__drop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // клик по фону закрывает, по контенту — нет
            if (e.target === e.currentTarget) closeMenu();
          }}
        >
          <button
            type="button"
            className="nav__close"
            aria-label="Закрыть меню"
            onClick={closeMenu}
          >
            <span />
          </button>

          <ul className="nav__mList" role="list">
            {LINKS.map((link) => (
              <li key={`m-${link.href}`} className="nav__mItem">
                <Link
                  href={link.href}
                  className="nav__mLink"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}