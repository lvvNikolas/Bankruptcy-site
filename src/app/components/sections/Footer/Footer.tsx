// src/app/components/sections/Footer/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Бренд и описание */}
          <div>
            <div className="footer-brand">Банкротство.РФ</div>
            <p>Помогаем законно списать долги по 127-ФЗ. Работаем по всей России.</p>
          </div>

          {/* Контакты */}
          <div>
            <div className="footer-heading">Контакты</div>
            <a href="tel:+79999999999">+7&nbsp;999&nbsp;999-99-99</a>
            <br />
            <a href="mailto:info@example.ru">info@example.ru</a>
          </div>

          {/* Юридические документы */}
          <div>
            <div className="footer-heading">Юридические</div>
            <a href="/politika-konfidencialnosti">Политика конфиденциальности</a>
            <br />
            <a href="/oferta">Публичная оферта</a>
          </div>
        </div>

        <div className="footer-copy">
          © {year} ООО&nbsp;«Юрцентр». ИНН&nbsp;0000000000
        </div>
      </div>
    </footer>
  );
}