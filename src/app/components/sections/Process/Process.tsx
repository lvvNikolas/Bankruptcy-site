// src/app/components/sections/Process/Process.tsx
type Props = { withHead?: boolean };

export default function Process({ withHead = true }: Props) {
  return (
    <section id="process" className="section process-wrap">
      <div className="container">
        <h2 className="sectionHead">Как проходит процедура</h2>
        <p className="sectionLead">
          Мы сопровождаем каждый этап: от первичной диагностики до полного списания долгов.
        </p>

        <div className="process-timeline">
          <div className="process-step">
            <div className="process-badge">1</div>
            <h3 className="process-title">Диагностика и сбор документов</h3>
            <p className="process-desc">
              Проверяем основания, перечень кредиторов, активов и обязательств.
            </p>
          </div>

          <div className="process-step">
            <div className="process-badge">2</div>
            <h3 className="process-title">Подача заявления</h3>
            <p className="process-desc">
              Готовим комплект и подаём в суд или МФЦ (при внесудебной процедуре).
            </p>
          </div>

          <div className="process-step">
            <div className="process-badge">3</div>
            <h3 className="process-title">Рассмотрение и взаимодействие</h3>
            <p className="process-desc">
              Представительство в процессе, запросы и коммуникация с кредиторами.
            </p>
          </div>

          <div className="process-step">
            <div className="process-badge">4</div>
            <h3 className="process-title">Завершение процедуры</h3>
            <p className="process-desc">
              Списание обязательств и рекомендации по восстановлению кредитной истории.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}