import styles from './Footer.module.css'

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>Банкротство.РФ</div>
            <p>Помогаем законно списать долги по 127-ФЗ. Работаем по РФ.</p>
          </div>
          <div>
            <div className={styles.h}>Контакты</div>
            <a href="tel:+79999999999">+7 999 999-99-99</a><br/>
            <a href="mailto:info@example.ru">info@example.ru</a>
          </div>
          <div>
            <div className={styles.h}>Юридические</div>
            <a href="/politika-konfidencialnosti">Политика конфиденциальности</a><br/>
            <a href="/oferta">Публичная оферта</a>
          </div>
        </div>
        <div className={styles.copy}>© {new Date().getFullYear()} ООО «Юрцентр». ИНН 0000000000</div>
      </div>
    </footer>
  )
}