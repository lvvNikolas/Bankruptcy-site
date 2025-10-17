// src/app/components/sections/Prices/Prices.tsx
type Props = { withHead?: boolean };

export default function Prices({ withHead = true }: Props) {
  return (
    <section id="ceny" className="section prices-wrap">
      <div className="container">
        <h2 className="sectionHead">Тарифы</h2>
        <p className="sectionLead">Честные цены без скрытых платежей. Возможна рассрочка.</p>

        <div className="prices-grid">
          <article className="prices-plan card">
            <h3>Старт</h3>
            <div className="prices-amount">от 39&nbsp;000&nbsp;₽</div>
            <p className="prices-note">Первичный анализ, комплект документов, подача.</p>
            <div className="prices-cta">
              <a href="#zayavka" className="btn btn-primary">Оставить заявку</a>
            </div>
          </article>

          <article className="prices-plan card">
            <h3>Стандарт</h3>
            <div className="prices-amount">от 79&nbsp;000&nbsp;₽</div>
            <p className="prices-note">Ведение дела, взаимодействие с кредиторами, представитель.</p>
            <div className="prices-cta">
              <a href="#zayavka" className="btn btn-primary">Оставить заявку</a>
            </div>
          </article>

          <article className="prices-plan card">
            <h3>Премиум</h3>
            <div className="prices-amount">индивидуально</div>
            <p className="prices-note">Сложные случаи, активы, оспаривание сделок, ускорение.</p>
            <div className="prices-cta">
              <a href="#zayavka" className="btn btn-primary">Оставить заявку</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}