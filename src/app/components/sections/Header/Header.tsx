"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent } from "react";
import "@styles/Header.css";

export default function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  // плавный скролл по якорям только на главной
  const smoothGo =
    (hash: string) =>
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!onHome) return; // на внутренних страницах пусть работает обычный переход на /#id
      e.preventDefault();
      const el = document.querySelector<HTMLElement>(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const toggle = document.getElementById("menu-toggle") as HTMLInputElement | null;
        if (toggle) toggle.checked = false; // закрыть моб. меню
      }
    };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {onHome ? (
        <>
          <a href="#debts" onClick={smoothGo("#debts")}>Долги</a>
          <a href="#uslugi" onClick={smoothGo("#uslugi")}>Услуги</a>
          <a href="#process" onClick={smoothGo("#process")}>Процесс</a>
          <a href="#quiz" onClick={smoothGo("#quiz")}>Опрос</a>
          <a href="#ceny" onClick={smoothGo("#ceny")}>Цены</a>
          <a href="#faq" onClick={smoothGo("#faq")}>FAQ</a>
          <a href="#kontakty" onClick={smoothGo("#kontakty")}>Контакты</a>
          <a
            href="#zayavka"
            onClick={smoothGo("#zayavka")}
            className={`btn btn-primary ${mobile ? "" : "header-cta"}`}
          >
            Заявка
          </a>
        </>
      ) : (
        <>
          <a href="/#debts">Долги</a>
          <a href="/#uslugi">Услуги</a>
          <a href="/#process">Процесс</a>
          <a href="/#quiz">Опрос</a>
          <a href="/#ceny">Цены</a>
          <a href="/#faq">FAQ</a>
          <a href="/#kontakty">Контакты</a>
          <a href="/#zayavka" className={`btn btn-primary ${mobile ? "" : "header-cta"}`}>
            Заявка
          </a>
        </>
      )}
    </>
  );

  return (
    <header className="header">
      <div className="container">
        <div className="header-row">
          <Link href="/" className="header-logo">Банкротство.РФ</Link>

          {/* desktop */}
          <nav className="header-navDesktop">
            <NavLinks />
          </nav>

          {/* burger toggle */}
          <input id="menu-toggle" type="checkbox" className="header-toggle" />
          <label htmlFor="menu-toggle" className="header-burger" aria-label="Меню">
            <span />
            <span />
            <span />
          </label>

          {/* mobile */}
          <nav
            className="header-navMobile"
            onClick={() => {
              const el = document.getElementById("menu-toggle") as HTMLInputElement | null;
              if (el) el.checked = false;
            }}
          >
            <NavLinks mobile />
          </nav>

          <a className="header-phone" href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
        </div>
      </div>
    </header>
  );
}