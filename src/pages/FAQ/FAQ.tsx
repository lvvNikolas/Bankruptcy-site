// src/pages/FAQ/FAQ.tsx
export default function FAQ(){
  return (
    <section>
      <title>FAQ по банкротству физлиц</title>
      <meta name="description" content="Ответы на частые вопросы: имущество, ограничения, сроки." />
      <h1>Частые вопросы</h1>
      <details>
        <summary>Какое имущество сохраняется?</summary>
        <p>Единственное жильё (если не ипотека), личные вещи и др. — согласно 127-ФЗ и ГПК.</p>
      </details>
      <details>
        <summary>Сколько длится процедура?</summary>
        <p>В среднем 6–12 месяцев, зависит от ситуации.</p>
      </details>
    </section>
  )
}