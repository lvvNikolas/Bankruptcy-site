// src/widgets/Header/Header.tsx
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  // плавный скролл по якорю и закрытие мобильного меню
  const smoothGo = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onHome) return // на внутренних не мешаем — сработает переход на /#id
    e.preventDefault()
    const el = document.querySelector<HTMLElement>(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // закрыть мобильное меню, если открыто
      const toggle = document.getElementById('menu-toggle') as HTMLInputElement | null
      if (toggle) toggle.checked = false
    }
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <Link to="/" className={styles.logo}>Банкротство.РФ</Link>

          {/* desktop */}
          <nav className={styles.navDesktop}>
            {onHome ? (
              <>
                <a href="#uslugi" onClick={smoothGo('#uslugi')}>Услуги</a>
                <a href="#debts"  onClick={smoothGo('#debts')}>Долги</a>
                <a href="#process" onClick={smoothGo('#process')}>Процесс</a>
                <a href="#quiz"    onClick={smoothGo('#quiz')}>Опрос</a>
                <a href="#ceny"    onClick={smoothGo('#ceny')}>Цены</a>
                <a href="#faq"     onClick={smoothGo('#faq')}>FAQ</a>
                <a href="#kontakty" onClick={smoothGo('#kontakty')}>Контакты</a>
                <a href="#zayavka" onClick={smoothGo('#zayavka')} className="btn btn-primary" style={{ padding: '8px 12px' }}>
                  Заявка
                </a>
              </>
            ) : (
              <>
                {/* На внутренних страницах ведём на /#id */}
                <a href="/#uslugi">Услуги</a>
                <a href="/#process">Процесс</a>
                <a href="/#debts">Долги</a> {/* ← добавили */}
                <a href="/#quiz">Опрос</a>
                <a href="/#ceny">Цены</a>
                <a href="/#faq">FAQ</a>
                <a href="/#kontakty">Контакты</a>
                <a href="/#zayavka" className="btn btn-primary" style={{ padding: '8px 12px' }}>
                  Заявка
                </a>
              </>
            )}
          </nav>

          {/* phone */}
          <input id="menu-toggle" type="checkbox" className={styles.toggle} />
          <label htmlFor="menu-toggle" className={styles.burger} aria-label="Меню">
            <span />
            <span />
            <span />
          </label>

          <nav
            className={styles.navMobile}
            onClick={() => {
              const el = document.getElementById('menu-toggle') as HTMLInputElement | null
              if (el) el.checked = false
            }}
          >
            {onHome ? (
              <>
                <a href="#uslugi" onClick={smoothGo('#uslugi')}>Услуги</a>
                <a href="#debts"  onClick={smoothGo('#debts')}>Долги</a>
                <a href="#process" onClick={smoothGo('#process')}>Процесс</a>
                <a href="#quiz"    onClick={smoothGo('#quiz')}>Опрос</a>
                <a href="#ceny"    onClick={smoothGo('#ceny')}>Цены</a>
                <a href="#faq"     onClick={smoothGo('#faq')}>FAQ</a>
                <a href="#kontakty" onClick={smoothGo('#kontakty')}>Контакты</a>
                <a href="#zayavka" onClick={smoothGo('#zayavka')} className="btn btn-primary" style={{ padding: '10px 14px', display: 'inline-block' }}>
                  Заявка
                </a>
              </>
            ) : (
              <>
                <a href="/#uslugi">Услуги</a>
                <a href="/#debts">Долги</a>
                <a href="/#process">Процесс</a>
                <a href="/#quiz">Опрос</a>
                <a href="/#ceny">Цены</a>
                <a href="/#faq">FAQ</a>
                <a href="/#kontakty">Контакты</a>
                <a href="/#zayavka" className="btn btn-primary" style={{ padding: '10px 14px', display: 'inline-block' }}>
                  Заявка
                </a>
              </>
            )}
          </nav>

          <a className={styles.phone} href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
        </div>
      </div>
    </header>
  )
}