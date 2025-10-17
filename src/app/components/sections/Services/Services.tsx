// src/app/components/sections/Services/Services.tsx
type Props = { withHead?: boolean };

export default function Services({ withHead = true }: Props) {
  return (
    <section id="uslugi" className="section services-wrap">
      <div className="container">
        <h2 className="sectionHead">Услуги</h2>
        <p className="sectionLead">
          Подберём оптимальную стратегию списания долгов и законно защитим ваши интересы.
        </p>

        <div className="services-grid">
          <article className="card services-item">
            <h3>Анализ и стратегия</h3>
            <p>Оцениваем риски, активы, кредиторов. Формируем пошаговый план.</p>
          </article>

          <article className="card services-item">
            <h3>Подготовка документов</h3>
            <p>Собираем и оформляем пакет для суда или МФЦ согласно 127-ФЗ.</p>
          </article>

          <article className="card services-item">
            <h3>Сопровождение в суде</h3>
            <p>Представительство, взаимодействие с кредиторами, финансовый управляющий.</p>
          </article>

          <article className="card services-item">
            <h3>Внесудебное банкротство</h3>
            <p>Полное сопровождение процедуры через МФЦ при выполнении условий.</p>
          </article>
        </div>

        <ul className="cleanList services-benefits">
          <li>Фиксированная стоимость работ</li>
          <li>Прозрачный договор и сроки</li>
          <li>Поддержка 7 дней в неделю</li>
        </ul>
      </div>
    </section>
  );
}