import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  // Если мы на главной — якоря, иначе — маршруты
  const Nav = () => (
    <>
      {onHome ? (
        <>
          <a href="#uslugi">Услуги</a>
          <a href="#process">Процесс</a>
          <a href="#quiz">Опрос</a>  
          <a href="#ceny">Цены</a>
          <a href="#faq">FAQ</a>
          <a href="#kontakty">Контакты</a>
          <a href="#zayavka" className="btn btn-primary" style={{padding:'8px 12px'}}>Заявка</a>
        </>
      ) : (
        <>
          <NavLink to="/uslugi">Услуги</NavLink>
          <NavLink to="/process">Процесс</NavLink>
           <NavLink to="/quiz">Опрос</NavLink> 
          <NavLink to="/ceny">Цены</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/kontakty">Контакты</NavLink>
          <a href="/#zayavka" className="btn btn-primary" style={{padding:'8px 12px'}}>Заявка</a>
        </>
      )}
    </>
  )

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <Link to="/" className={styles.logo}>Банкротство.РФ</Link>

          {/* desktop */}
          <nav className={styles.navDesktop}>
            <Nav/>
          </nav>

          {/* phone */}
          <input id="menu-toggle" type="checkbox" className={styles.toggle}/>
          <label htmlFor="menu-toggle" className={styles.burger} aria-label="Меню">
            <span/>
            <span/>
            <span/>
          </label>
          <nav className={styles.navMobile} onClick={()=>{
            // закрыть меню при клике по ссылке
            const el = document.getElementById('menu-toggle') as HTMLInputElement|null
            if (el) el.checked = false
          }}>
            <Nav/>
          </nav>

          <a className={styles.phone} href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
        </div>
      </div>
    </header>
  )
}