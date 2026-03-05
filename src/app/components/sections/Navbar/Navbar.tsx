"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import "@styles/Navbar.css";

/** Ссылки меню */
const LINKS = [
  { href: "/", label: "Главная" },
  { href: "/cases", label: "Выигранные дела" },
  { href: "/blog", label: "Блог" },
  { href: "/faq", label: "Вопросы и ответы" },
  { href: "/career", label: "Карьера" },
  { href: "/programma-loyalnosti", label: "Программа лояльности" },
  { href: "/contacts", label: "Контакты" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Блокируем скролл страницы, когда меню открыто
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [open]);

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Логотип слева */}
        <Link href="/" className="nav__logo" aria-label="На главную" onClick={closeMenu}>
          <Image src="/media/logo.png" alt="Логотип" width={42} height={42} priority />
        </Link>

        {/* Десктоп-меню по центру */}
        <nav className="nav__desk" aria-label="Основное меню">
          <ul className="nav__list" role="list">
            {LINKS.map((link) => (
              <li key={link.href} className="nav__item">
                <Link href={link.href as Route} className="nav__link">
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
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ✅ Мобильный оверлей (НА ВЕСЬ ЭКРАН) */}
      {open && (
        <div
          className="nav__overlay"
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
          onClick={(e) => {
            // клик по фону закрывает, по контенту — нет
            if (e.target === e.currentTarget) closeMenu();
          }}
        >
          <div className="nav__overlayInner">
            <button type="button" className="nav__close" aria-label="Закрыть меню" onClick={closeMenu}>
              <span />
            </button>

            <ul className="nav__mList" role="list">
              {LINKS.map((link, i) => (
                <li key={`m-${link.href}`} className="nav__mItem" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={link.href as Route} className="nav__mLink" onClick={closeMenu}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <a href="tel:+79162979645" className="nav__mCta" onClick={closeMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.5 2.5.7 3.9.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.4.2 2.7.7 3.9.1.4 0 .8-.2 1.1L6.6 10.8Z"/>
              </svg>
              +7 (916) 297-96-45
            </a>
          </div>
        </div>
      )}
    </header>
  );
}