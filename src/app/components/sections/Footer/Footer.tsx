import Link from "next/link";
import "@styles/Footer.css";
import {
  PHONE_HREF,
  PHONE_DISPLAY,
  EMAIL,
  EMAIL_HREF,
  ADDRESS,
  WORKING_HOURS,
  TELEGRAM_BOT,
} from "@/config";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Левый столбец: бренд + описание + TG + рейтинг */}
          <div className="footer__col">
            <div className="footer__logo" aria-label="Юридическое агентство по банкротству Солюшен">
              Юридическое агентство<br />по банкротству Солюшен
            </div>
            <p className="footer__lead">
              Помогаем законно списать долги по 127-ФЗ. Работаем по всей России.
            </p>

            <a
              className="footer__tgBtn"
              href={TELEGRAM_BOT}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M22 3 2 11l6.6 2.5L20 6 10.8 14.7l.2 5.3 3.3-3.3 4.9 3.6L22 3Z"
                  fill="currentColor"
                />
              </svg>
              <span>Написать в Telegram</span>
            </a>

            <div className="footer__rating" aria-label="Рейтинг по отзывам Яндекс">
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path
                  d="M12 .6 15 9l9 .8-7 5.6 2.3 8.8L12 18l-7.3 6.2L7 15.4 0 9.8 9 9l3-8.4Z"
                  fill="#F8D33A"
                />
              </svg>
              <div>
                <div className="footer__ratingTitle">Отзывы Яндекс</div>
                <div className="footer__ratingValue">4.9</div>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <nav className="footer__col" aria-label="Навигация">
            <div className="footer__heading">Навигация</div>
            <ul className="footer__list">
              <li><Link href="/">Главная</Link></li>
              <li><Link href="/cases">Выигранные дела</Link></li>
              <li><Link href="/blog">Блог</Link></li>
              <li><Link href="/otzyvy">Отзывы клиентов</Link></li>
              <li><Link href="/faq">Вопросы и ответы</Link></li>
              <li><Link href="/career">Карьера</Link></li>
            </ul>
          </nav>

          {/* Разделы */}
          <nav className="footer__col" aria-label="Разделы">
            <div className="footer__heading">Разделы</div>
            <ul className="footer__list">
              <li><Link href="/contacts">Контакты</Link></li>
              <li><Link href="/programma-loyalnosti">Программа лояльности</Link></li>
              <li><Link href="/calculator">Калькулятор</Link></li>
              <li><Link href="/sitemap">Карта сайта</Link></li>
              <li><Link href="/politika-konfidentsialnosti">Политика конфиденциальности</Link></li>
            </ul>
          </nav>

          {/* Контакты */}
          <address className="footer__col footer__contacts" aria-label="Контакты">
            <div className="footer__contactItem">
              <span className="footer__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.6 0 1 .4 1 .9v3.5c0 .6-.4 1-1 1C9.8 21 3 14.2 3 5.3c0-.6.4-1 1-1H7.5c.6 0 1 .4 1 .9 0 1.1.2 2.1.6 3.1.1.4.1.9-.2 1.2l-2.3 2.3Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div>
                <div className="footer__phoneRow">
                  <span className="footer__titleText">Звоните, поможем</span>
                  <span className="footer__badgeOnline">На связи</span>
                  <a className="footer__link footer__phone" href={PHONE_HREF}>
                    {PHONE_DISPLAY}
                  </a>
                </div>
                <div className="footer__meta">{WORKING_HOURS}</div>
              </div>
            </div>

            <div className="footer__contactItem">
              <span className="footer__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h16a2 2 0 0 1 2 2v.3l-10 6-10-6V8a2 2 0 0 1 2-2Zm-2 5.4 9.3 5.6a2 2 0 0 0 2 0L22 11.4V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.6Z" />
                </svg>
              </span>
              <div>
                <div className="footer__contactTitle">Пишите, ответим</div>
                <a className="footer__link" href={EMAIL_HREF}>
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="footer__contactItem">
              <span className="footer__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
              </span>
              <div>
                <div className="footer__contactTitle">Приезжайте, обсудим</div>
                <div className="footer__address">{ADDRESS}</div>
              </div>
            </div>
          </address>
        </div>

        {/* Нижняя полоса */}
        <div className="footer__bottom">
          <nav className="footer__legal" aria-label="Юридическая информация">
            <Link href="/politika-konfidentsialnosti">Политика обработки персональных данных</Link>
            <Link href="/sitemap">Карта сайта</Link>
          </nav>

          <div className="footer__copy">
            © Юридическое агентство по банкротству Солюшен, 2019–{YEAR}. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}
