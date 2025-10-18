"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";
import "@styles/Header.css";

export default function Header() {
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
        // закрываем моб.меню если открыто
        const toggle = document.getElementById("menu-toggle") as HTMLInputElement | null;
        if (toggle) toggle.checked = false;
      }
    };

  /** Вспомогалка для корректного Link на /#hash */
  const toUrlObject = (hash: string) =>
    ({ pathname: "/", hash: hash.slice(1) } as const);

  /** Набор ссылок меню */
  const links = [
    { hash: "#debts", label: "Долги" },
    { hash: "#uslugi", label: "Услуги" },
    { hash: "#process", label: "Процесс" },
    { hash: "#quiz", label: "Опрос" },
    { hash: "#ceny", label: "Цены" },
    { hash: "#faq", label: "FAQ" },
    { hash: "#kontakty", label: "Контакты" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {links.map(({ hash, label }) =>
        onHome ? (
          // На главной можно использовать обычные якоря (ESLint не ругается на "#...")
          <a key={hash} href={hash} onClick={smoothGo(hash)}>
            {label}
          </a>
        ) : (
          // На внутренних страницах — только Link (иначе ругается @next/no-html-link-for-pages)
          <Link key={hash} href={toUrlObject(hash)}>
            {label}
          </Link>
        )
      )}

      {onHome ? (
        <a
          href="#zayavka"
          onClick={smoothGo("#zayavka")}
          className={`btn btn-primary ${mobile ? "" : "header-cta"}`}
        >
          Заявка
        </a>
      ) : (
        <Link
          href={toUrlObject("#zayavka")}
          className={`btn btn-primary ${mobile ? "" : "header-cta"}`}
        >
          Заявка
        </Link>
      )}
    </>
  );

  return (
    <header className="header">
      <div className="container">
        <div className="header-row">
          <Link href="/" className="header-logo">
            Банкротство.РФ
          </Link>

          {/* desktop */}
          <nav className="header-navDesktop">
            <NavLinks />
          </nav>

          {/* переключатель бургера */}
          <input id="menu-toggle" type="checkbox" className="header-toggle" />
          <label htmlFor="menu-toggle" className="header-burger" aria-label="Меню">
            <span />
            <span />
            <span />
          </label>

          {/* mobile full-screen */}
          <nav
            className="header-navMobile"
            onClick={() => {
              const t = document.getElementById("menu-toggle") as HTMLInputElement | null;
              if (t) t.checked = false;
            }}
          >
            <button
              className="header-close"
              aria-label="Закрыть меню"
              onClick={(e) => {
                e.stopPropagation();
                const t = document.getElementById("menu-toggle") as HTMLInputElement | null;
                if (t) t.checked = false;
              }}
            >
              <span />
              <span />
            </button>

            <div className="header-navMobile-inner">
              <NavLinks mobile />
            </div>
          </nav>

          <a className="header-phone" href="tel:+79999999999">
            +7&nbsp;999&nbsp;999-99-99
          </a>
        </div>
      </div>
    </header>
  );
}