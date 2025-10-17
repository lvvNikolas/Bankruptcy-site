// src/app/components/sections/FAQ/FAQ.tsx
import Head from "next/head";

type Props = { withHead?: boolean };

export default function FAQ({ withHead = true }: Props) {
  return (
    <section id="faq" className="section faq-wrap">
      {withHead && (
        <Head>
          <title>FAQ по банкротству физлиц</title>
          <meta
            name="description"
            content="Ответы на частые вопросы: имущество, ограничения, сроки."
          />
        </Head>
      )}

      <div className="container">
        <h2 className="sectionHead">Частые вопросы</h2>

        <div className="faq-item">
          <details>
            <summary>Какое имущество сохраняется?</summary>
            <p>
              Единственное жильё (если не ипотека), личные вещи и др. — согласно
              127-ФЗ и нормам процессуального законодательства.
            </p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>Сколько длится процедура?</summary>
            <p>В среднем 6–12 месяцев — зависит от числа кредиторов и обстоятельств.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>Можно ли кредитоваться после банкротства?</summary>
            <p>
              Да, но банки оценивают риски. Мы даём рекомендации по восстановлению
              кредитной истории.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}