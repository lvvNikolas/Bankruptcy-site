"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import "@styles/Navbar.css";
import { PHONE_HREF, PHONE_DISPLAY } from "@/config";

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
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  // Отслеживаем скролл
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокируем скролл страницы, когда меню открыто
  useEffect(() => {
    if (!open && !searchOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [open, searchOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!open && !searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, searchOpen]);

  // Фокус на инпут при открытии поиска
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/blog?q=${encodeURIComponent(query.trim())}` as Route);
  };

  return (
    <>
      <header className={`nav ${isTransparent ? "nav--transparent" : ""}`}>
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
                  <Link
                    href={link.href as Route}
                    className={`nav__link ${isActive(link.href) ? "nav__link--active" : ""}`}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Правая часть: поиск + бургер */}
          <div className="nav__right">
            {/* Кнопка поиска (десктоп) */}
            <button
              type="button"
              className="nav__searchBtn"
              aria-label="Открыть поиск"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="nav__searchLabel">Поиск</span>
            </button>

            {/* Бургер (мобилка) */}
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
        </div>
      </header>

      {/* Поисковой оверлей */}
      {searchOpen && (
        <div
          className="nav__searchOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Поиск по сайту"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="nav__searchBox">
            <form onSubmit={handleSearchSubmit} className="nav__searchForm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav__searchIcon" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                className="nav__searchInput"
                placeholder="Поиск по статьям, вопросам..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button type="submit" className="nav__searchSubmit" aria-label="Найти">
                  Найти
                </button>
              )}
            </form>
            <p className="nav__searchHint">Нажмите Enter или кнопку «Найти»</p>
          </div>
        </div>
      )}

      {/* Мобильный оверлей */}
      {open && (
        <div
          className="nav__overlay"
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
          onClick={(e) => {
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
                  <Link
                    href={link.href as Route}
                    className={`nav__mLink ${isActive(link.href) ? "nav__mLink--active" : ""}`}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <a href={PHONE_HREF} className="nav__mCta" onClick={closeMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.5 2.5.7 3.9.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.4.2 2.7.7 3.9.1.4 0 .8-.2 1.1L6.6 10.8Z"/>
              </svg>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
