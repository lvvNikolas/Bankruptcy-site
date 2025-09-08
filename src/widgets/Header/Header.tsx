import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <Link to="/" className={styles.logo}>Банкротство.РФ</Link>

          {/* Когда мы на главной — используем якоря; на внутренних — обычные ссылки */}
          <nav className={styles.nav}>
            {onHome ? (
              <>
                <a href="#uslugi">Услуги</a>
                <a href="#process">Процесс</a>
                <a href="#ceny">Цены</a>
                <a href="#faq">FAQ</a>
                <a href="#kontakty">Контакты</a>
              </>
            ) : (
              <>
                <NavLink to="/uslugi">Услуги</NavLink>
                <NavLink to="/process">Процесс</NavLink>
                <NavLink to="/ceny">Цены</NavLink>
                <NavLink to="/faq">FAQ</NavLink>
                <NavLink to="/kontakty">Контакты</NavLink>
              </>
            )}
          </nav>

          <a className={styles.phone} href="tel:+79999999999">+7 999 999-99-99</a>
        </div>
      </div>
    </header>
  );
}