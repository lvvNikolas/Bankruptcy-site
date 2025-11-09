"use client";

import Head from "next/head";
import "@styles/FAQ.css";

type Props = { withHead?: boolean };

export default function FAQ({ withHead = true }: Props) {
  return (
    <section id="faq" className="faq section" aria-labelledby="faq-title">
      {withHead && (
        <Head>
          <title>FAQ по банкротству физических лиц</title>
          <meta
            name="description"
            content="Ответы на частые вопросы: имущество, ограничения, сроки, последствия и возможности после банкротства."
          />
        </Head>
      )}

      <div className="container">
        <header className="faq__head">
          <h2 id="faq-title" className="faq__title sectionHead">
            Частые вопросы
          </h2>
          <p className="faq__subtitle sectionLead">
            Мы собрали самые распространённые вопросы о банкротстве и ответили на них простым языком.
          </p>
        </header>

        <div className="faq__list">
          <details className="faq__item">
            <summary>Какое имущество сохраняется при банкротстве?</summary>
            <p>
              Единственное жильё (если не находится в ипотеке), личные вещи, бытовая техника
              первой необходимости, предметы труда и другие исключения — в соответствии с
              Федеральным законом № 127-ФЗ и нормами процессуального законодательства.
            </p>
          </details>

          <details className="faq__item">
            <summary>Сколько длится процедура банкротства?</summary>
            <p>
              В среднем процедура занимает от <strong>6 до 12 месяцев</strong> —
              в зависимости от числа кредиторов, размера долгов и загруженности суда.
            </p>
          </details>

          <details className="faq__item">
            <summary>Можно ли брать кредиты после банкротства?</summary>
            <p>
              Да, кредитование возможно. Банки оценивают риски индивидуально.
              Мы поможем восстановить кредитную историю и дадим рекомендации по дальнейшим действиям.
            </p>
          </details>

          <details className="faq__item">
            <summary>Сколько стоит процедура банкротства?</summary>
            <p>
              Стоимость зависит от количества кредиторов и особенностей вашего дела.
              Первичная консультация — <strong>бесплатна</strong>, где мы подробно расскажем, какие расходы вас ждут.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}