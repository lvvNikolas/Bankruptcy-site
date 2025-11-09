"use client";

import "@styles/Services.css";

type Props = { withHead?: boolean };

export default function Services({ withHead = true }: Props) {
  return (
    <section
      id="uslugi"
      className="services section"
      aria-labelledby="services-title"
    >
      <div className="container">
        <header className="services__head">
          {withHead && (
            <p className="services__eyebrow">
              Юридическое сопровождение банкротства
            </p>
          )}

          <h2 id="services-title" className="services__title sectionHead">
            Услуги
          </h2>

          <p className="services__subtitle sectionLead">
            Подберём оптимальную стратегию списания долгов и законно защитим ваши
            интересы на каждом этапе процедуры.
          </p>
        </header>

        <div className="services__grid">
          <article className="card services__item">
            <h3 className="services__itemTitle">Анализ и стратегия</h3>
            <p className="services__itemText">
              Оцениваем риски, активы, кредиторов и перспективы дела. Формируем
              понятный пошаговый план действий под вашу ситуацию.
            </p>
          </article>

          <article className="card services__item">
            <h3 className="services__itemTitle">Подготовка документов</h3>
            <p className="services__itemText">
              Собираем и оформляем полный пакет документов для суда или МФЦ в
              соответствии с требованиями 127-ФЗ.
            </p>
          </article>

          <article className="card services__item">
            <h3 className="services__itemTitle">Сопровождение в суде</h3>
            <p className="services__itemText">
              Представляем ваши интересы в арбитражном суде, взаимодействуем с
              кредиторами и финансовым управляющим до списания долгов.
            </p>
          </article>

          <article className="card services__item">
            <h3 className="services__itemTitle">Внесудебное банкротство</h3>
            <p className="services__itemText">
              Полностью сопровождаем процедуру через МФЦ при соблюдении условий:
              готовим заявления, отслеживаем сроки, контролируем результат.
            </p>
          </article>
        </div>

        <ul className="cleanList services__benefits">
          <li>Фиксированная стоимость работ</li>
          <li>Прозрачный договор и понятные сроки</li>
          <li>Поддержка на связи 7 дней в неделю</li>
        </ul>
      </div>
    </section>
  );
}