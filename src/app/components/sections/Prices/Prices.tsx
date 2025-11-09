// src/app/components/sections/Prices/Prices.tsx

import "@styles/Prices.css";

type Props = { withHead?: boolean };

export default function Prices({ withHead = true }: Props) {
  return (
    <section
      id="ceny"
      className="prices section"
      aria-labelledby="prices-title"
    >
      <div className="container">
        <header className="prices__head">
          {withHead && (
            <p className="prices__eyebrow">
              Тарифы по банкротству физических лиц
            </p>
          )}

          <h2 id="prices-title" className="prices__title sectionHead">
            Тарифы
          </h2>

          <p className="prices__subtitle sectionLead">
            Честные фиксированные цены без скрытых платежей. Возможна
            рассрочка и поэтапная оплата.
          </p>
        </header>

        <div className="prices__grid">
          {/* Старт */}
          <article className="prices__plan prices__plan--basic card">
            <div className="prices__planTop">
              <h3 className="prices__planName">Старт</h3>
              <p className="prices__planDesc">
                Для тех, кто только начинает процедуру и хочет всё оформить
                правильно.
              </p>
            </div>

            <div className="prices__priceBlock">
              <div className="prices__amount">
                от 39&nbsp;000&nbsp;₽
              </div>
              <p className="prices__note">
                Первичный анализ ситуации, подготовка и подача полного
                комплекта документов в суд.
              </p>
            </div>

            <div className="prices__footer">
              <p className="prices__tagline">
                Оплата поэтапно, без переплат.
              </p>
              <a href="#zayavka" className="btn btn-primary prices__btn">
                Оставить заявку
              </a>
            </div>
          </article>

          {/* Стандарт — рекомендуемый */}
          <article className="prices__plan prices__plan--pro card">
            <div className="prices__badge">Рекомендуем</div>

            <div className="prices__planTop">
              <h3 className="prices__planName">Стандарт</h3>
              <p className="prices__planDesc">
                Полное сопровождение банкротства до списания долгов.
              </p>
            </div>

            <div className="prices__priceBlock">
              <div className="prices__amount">
                от 79&nbsp;000&nbsp;₽
              </div>
              <p className="prices__note">
                Ведение дела в суде, взаимодействие с кредиторами,
                арбитражный управляющий и юридическое сопровождение до
                завершения процедуры.
              </p>
            </div>

            <div className="prices__footer">
              <p className="prices__tagline">
                Оптимальный вариант для большинства клиентов.
              </p>
              <a href="#zayavka" className="btn btn-primary prices__btn">
                Оставить заявку
              </a>
            </div>
          </article>

          {/* Премиум */}
          <article className="prices__plan prices__plan--premium card">
            <div className="prices__planTop">
              <h3 className="prices__planName">Премиум</h3>
              <p className="prices__planDesc">
                Для сложных и нестандартных ситуаций с активами и
                оспариванием сделок.
              </p>
            </div>

            <div className="prices__priceBlock">
              <div className="prices__amount prices__amount--muted">
                индивидуально
              </div>
              <p className="prices__note">
                Включает защиту значительного имущества, оспаривание
                сделок, работу с несколькими регионами и сложной
                кредиторской структурой.
              </p>
            </div>

            <div className="prices__footer">
              <p className="prices__tagline">
                Подберём решение и стоимость после анализа вашего дела.
              </p>
              <a href="#zayavka" className="btn btn-primary prices__btn">
                Оставить заявку
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}