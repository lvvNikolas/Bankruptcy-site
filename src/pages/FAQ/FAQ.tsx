// src/pages/FAQ/FAQ.tsx
type Props = { withHead?: boolean };
import styles from "./FAQ.module.css";

export default function FAQ({ withHead = true }: Props) {
  return (
    <section id="faq" className={`${styles.wrap} section`}>
      {withHead && (
        <>
          <title>FAQ по банкротству физлиц</title>
          <meta
            name="description"
            content="Ответы на частые вопросы: имущество, ограничения, сроки."
          />
        </>
      )}

      <div className="container">
        <h1 className="sectionHead">Частые вопросы</h1>

        <div className={styles.item}>
          <details>
            <summary>Какое имущество сохраняется?</summary>
            <p>
              Единственное жильё (если не ипотека), личные вещи и др. — согласно
              127-ФЗ и нормам процессуального законодательства.
            </p>
          </details>
        </div>

        <div className={styles.item}>
          <details>
            <summary>Сколько длится процедура?</summary>
            <p>В среднем 6–12 месяцев — зависит от числа кредиторов и обстоятельств.</p>
          </details>
        </div>

        <div className={styles.item}>
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