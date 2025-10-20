"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";
import "@styles/Navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  /** Плавный скролл только на главной */
  const smoothGo =
    (hash: string) =>
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!onHome) return; // на внутренних страницах якоря не перехватываем
      e.preventDefault();
      const el = document.querySelector<HTMLElement>(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // закрываем моб.меню, если открыто
        const toggle = document.getElementById("navbar-toggle") as HTMLInputElement | null;
        if (toggle) toggle.checked = false;
      }
    };

  /** Корректный объект для Link на /#hash (чтобы не ругался линтер) */
  const toUrlObject = (hash: string) =>
    ({ pathname: "/", hash: hash.slice(1) } as const);

  /** Ссылки меню */
  const links = [
    { hash: "#debts", label: "Долги" },
    { hash: "#uslugi", label: "Услуги" },
    { hash: "#process", label: "Процесс" },
    { hash: "#quiz", label: "Опрос" },
    { hash: "#ceny", label: "Цены" },
    { hash: "#faq", label: "FAQ" },
    { hash: "#kontakty", label: "Контакты" },
  ];

  /** Общий рендер ссылок (desktop/mobile) */
  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {links.map(({ hash, label }) =>
        onHome ? (
          <a key={hash} href={hash} onClick={smoothGo(hash)}>
            {label}
          </a>
        ) : (
          <Link key={hash} href={toUrlObject(hash)}>
            {label}
          </Link>
        )
      )}

      {onHome ? (
        <a
          href="#zayavka"
          onClick={smoothGo("#zayavka")}
          className={`btn btn-primary ${mobile ? "" : "navbar-cta"}`}
        >
          Заявка
        </a>
      ) : (
        <Link
          href={toUrlObject("#zayavka")}
          className={`btn btn-primary ${mobile ? "" : "navbar-cta"}`}
        >
          Заявка
        </Link>
      )}
    </>
  );

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <div className="navbar-row">
          <Link href="/" className="navbar-logo" aria-label="На главную">
            Банкротство.РФ
          </Link>

          {/* Desktop */}
          <nav className="navbar-desktop" aria-label="Основное меню">
            <NavLinks />
          </nav>

          {/* Burger toggle */}
          <input id="navbar-toggle" type="checkbox" className="navbar-toggle" />
          <label htmlFor="navbar-toggle" className="navbar-burger" aria-label="Меню">
            <span />
            <span />
            <span />
          </label>

          {/* Mobile overlay */}
          <nav
            className="navbar-overlay"
            aria-label="Мобильное меню"
            onClick={() => {
              const t = document.getElementById("navbar-toggle") as HTMLInputElement | null;
              if (t) t.checked = false;
            }}
          >
            <button
              className="navbar-close"
              aria-label="Закрыть меню"
              onClick={(e) => {
                e.stopPropagation();
                const t = document.getElementById("navbar-toggle") as HTMLInputElement | null;
                if (t) t.checked = false;
              }}
            >
              <span />
              <span />
            </button>

            <div className="navbar-overlay-inner" onClick={(e) => e.stopPropagation()}>
              <div className="navbar-overlay-list">
                <NavLinks mobile />
              </div>
            </div>
          </nav>

          {/* Телефон справа (desktop) */}
          <a className="navbar-phone" href="tel:+79999999999">
            +7&nbsp;999&nbsp;999-99-99
          </a>
        </div>
      </div>
    </header>
  );
}