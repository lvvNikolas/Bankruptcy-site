"use client";

import Head from "next/head";

type Props = { withHead?: boolean };

export default function Contacts({ withHead = true }: Props) {
  return (
    <section id="kontakty" className="section">
      {/* Мета-теги в <Head> */}
      {withHead && (
        <Head>
          <title>Контакты</title>
          <meta
            name="description"
            content="Позвоните нам или оставьте заявку на сайте."
          />
        </Head>
      )}

      <div className="container">
        <h2 className="sectionHead">Контакты</h2>
        <p className="sectionLead">Свяжитесь с нами удобным для вас способом:</p>

        <div style={{ marginTop: "1.5rem" }}>
          <p>
            📞 Телефон:{" "}
            <a href="tel:+79999999999" className="link">
              +7&nbsp;999&nbsp;999-99-99
            </a>
          </p>
          <p>
            ✉️ E-mail:{" "}
            <a href="mailto:info@example.ru" className="link">
              info@example.ru
            </a>
          </p>
          <p>🏙️ Адрес: Москва, ул.&nbsp;Пример,&nbsp;1</p>
        </div>
      </div>
    </section>
  );
}