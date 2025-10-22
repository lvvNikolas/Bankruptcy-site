"use client";

import Link from "next/link";
import type { Route } from "next";
import "@styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Бренд + описание + CTA */}
          <section className="footer__col footer__brand" aria-label="О компании">
            <h3 className="footer__logo">Банкротство.РФ</h3>
            <p className="footer__lead">
              Помогаем законно списать долги по 127-ФЗ. Работаем по всей России.
            </p>

            <a
              className="footer__tgBtn"
              href="https://t.me/your_username"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M9.16 14.7l-.37 3.88c.53 0 .76-.23 1.04-.5l2.5-2.38 5.2 3.82c.95.52 1.62.25 1.87-.88l3.4-15.92v0c.3-1.43-.52-1.99-1.43-1.65L1.34 9.28C-.06 9.83-.04 10.62 1.09 10.96l4.98 1.56L18.95 4.6c.56-.34 1.07-.15.65.19"
                />
              </svg>
              Написать в Telegram
            </a>
          </section>

          {/* Навигация */}
          <nav className="footer__col" aria-label="Навигация">
            <h4 className="footer__heading">Навигация</h4>
            <ul className="footer__list">
              <li><Link href={"/" as Route}>Главная</Link></li>
              <li><Link href={"/tarify" as Route}>Тарифы</Link></li>
              <li><Link href={"/cases" as Route}>Выигранные дела</Link></li>
              <li><Link href={"/faq" as Route}>Вопросы и ответы</Link></li>
              <li><Link href={"/career" as Route}>Карьера</Link></li>
            </ul>
          </nav>

          {/* Разделы */}
          <nav className="footer__col" aria-label="Разделы">
            <h4 className="footer__heading">Разделы</h4>
            <ul className="footer__list">
              <li><Link href={"/oplata" as Route}>Оплата</Link></li>
              <li><Link href={"/kontakty" as Route}>Контакты</Link></li>
              <li><Link href={"/blog" as Route}>Блог</Link></li>
              <li><Link href={"/sitemap" as Route}>Карта сайта</Link></li>
            </ul>
          </nav>

          {/* Контакты */}
          <address className="footer__col footer__contacts" aria-label="Контакты">
            <h4 className="footer__heading">Контакты</h4>

            <div className="footer__contactItem">
              <span className="footer__ico" aria-hidden>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.2-.2.5-.3.8-.2 1 .3 2 .5 3 .6.4 0 .7.3.7.7v3.3c0 .4-.3.7-.7.7C9.5 20 4 14.5 4 7.7c0-.4.3-.7.7-.7H8c.4 0 .7.3.7.7.1 1 .3 2 .6 3 .1.3 0 .6-.2.8l-2 2z"/></svg>
              </span>
              <a href="tel:+79324990000" className="footer__link">+7 (932) 499-00-00</a>
              <div className="footer__meta">Ежедневно с 9:00 до 21:00</div>
            </div>

            <div className="footer__contactItem">
              <span className="footer__ico" aria-hidden>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5L4 8V6l8 5 8-5v2z"/></svg>
              </span>
              <a href="mailto:info@donulya.ru" className="footer__link">info@donulya.ru</a>
            </div>

            <div className="footer__contactItem">
              <span className="footer__ico" aria-hidden>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>
              </span>
              <div className="footer__link">Нижняя Радищевская улица, 5с3</div>
            </div>
          </address>
        </div>

        <div className="footer__bottom">
          <nav className="footer__legal" aria-label="Юридическая информация">
            <Link href={"/politika-konfidencialnosti" as Route}>Политика конфиденциальности</Link>
            <Link href={"/pdn" as Route}>Политика обработки персональных данных</Link>
            <Link href={"/requisites" as Route}>Реквизиты</Link>
            <Link href={"/oferta" as Route}>Оферта</Link>
          </nav>

          <div className="footer__copy">
            © «ДОНУЛЯ», {year}. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}