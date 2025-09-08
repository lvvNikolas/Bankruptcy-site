type Props = { withHead?: boolean };

export default function Contacts({ withHead = true }: Props) {
  return (
    <section id="kontakty">
      {withHead && (
        <>
          <title>Контакты</title>
          <meta
            name="description"
            content="Позвоните нам или оставьте заявку на сайте."
          />
        </>
      )}
      <h1>Контакты</h1>
      <p>
        Тел.: <a href="tel:+79999999999">+7 999 999-99-99</a>
      </p>
      <p>
        E-mail: <a href="mailto:info@example.ru">info@example.ru</a>
      </p>
      <p>Адрес: Москва, ул. Пример, 1</p>
    </section>
  );
}