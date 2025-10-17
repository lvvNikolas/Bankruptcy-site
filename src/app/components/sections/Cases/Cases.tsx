"use client";

import { useEffect, useRef, useState } from "react";
import "@styles/Cases.css";

type CaseItem = {
  id: string;
  name: string;
  amount: string;
  caseNo: string;
  preview: string;
  full: string;
};

const DATA: CaseItem[] = [
  { id:"c7", name:"Ольга К.", amount:"455 000 ₽", caseNo:"А33-554433/2023",
    preview:"Чёткая работа, грамотные пояснения суду, уважительное отношение.",
    full:"Чёткая работа, грамотные пояснения суду, уважительное отношение. Спасибо за поддержку и результат." },
  { id:"c8", name:"Игорь Н.", amount:"872 140 ₽", caseNo:"А07-110022/2024",
    preview:"Подсказали, как подготовиться, чтобы ускорить процедуру.",
    full:"Подсказали, как подготовиться, чтобы ускорить процедуру. Всё сделали в заявленные сроки, всегда на связи." },
  { id:"c9", name:"Светлана Р.", amount:"268 300 ₽", caseNo:"А50-660077/2024",
    preview:"Спасибо за доброжелательность и профессионализм. Итогом довольна.",
    full:"Спасибо за доброжелательность и профессионализм. Ответы по сути, без воды. Итогом довольна." },
  { id:"c1", name:"Чирцов Николай", amount:"798 759 ₽", caseNo:"А03-19570/2023",
    preview:"Профессионалы своего дела. Всем рекомендую, обращайтесь — не пожалеете.",
    full:"Подсказали стратегию, подготовили документы, всегда были на связи. Итог — списание долга в полном объёме." },
  { id:"c2", name:"Касымов Владимир Андреевич", amount:"537 438 ₽", caseNo:"А70-21197/2023",
    preview:"Консультировали 24/7, понравилась цена и рассрочка.",
    full:"Оперативно отвечали на вопросы по документам и шагам процедуры. Стоимость разумная, рассрочка выручила." },
  { id:"c3", name:"Елена Вархенко", amount:"1 743 585 ₽", caseNo:"А45-5054/2024",
    preview:"Через 9 месяцев полностью освобождена от долгов.",
    full:"Команда всё объясняла заранее. Никаких скрытых платежей, все условия выполнялись строго." },
  { id:"c4", name:"Артём С.", amount:"612 210 ₽", caseNo:"А40-112233/2023",
    preview:"Пакет собрали за неделю и подали в срок — без стресса.",
    full:"На каждом этапе объясняли, что происходит, риски и сроки. Итогом доволен." },
  { id:"c5", name:"Мария Т.", amount:"321 990 ₽", caseNo:"А56-998877/2024",
    preview:"Корректная коммуникация и чёткий план действий.",
    full:"Быстро решали вопросы, помогли с подготовкой и взаимодействием с кредиторами." },
  { id:"c6", name:"Виктор П.", amount:"1 102 350 ₽", caseNo:"А12-221144/2023",
    preview:"Сложный кейс, но справились: долги списаны.",
    full:"Объяснили варианты, выбрали оптимальный. Долги списаны, имущество сохранили." },
];

export default function Cases() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [opened, setOpened] = useState<CaseItem | null>(null);

  const recalcPages = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    const total = Math.ceil(vp.scrollWidth / vp.clientWidth);
    setPages(Math.max(1, total));
    const current = Math.round(vp.scrollLeft / vp.clientWidth);
    setPage(Math.min(current, total - 1));
  };

  useEffect(() => {
    recalcPages();
    const onResize = () => recalcPages();
    window.addEventListener("resize", onResize);

    const vp = viewportRef.current;
    const onScroll = () => {
      if (!vp) return;
      setPage(Math.round(vp.scrollLeft / vp.clientWidth));
    };
    vp?.addEventListener("scroll", onScroll, { passive: true });

    const t = setTimeout(recalcPages, 0);

    return () => {
      window.removeEventListener("resize", onResize);
      vp?.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const goTo = (p: number) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const clamped = Math.max(0, Math.min(pages - 1, p));
    vp.scrollTo({ left: clamped * vp.clientWidth, behavior: "smooth" });
  };

  const closeModal = () => setOpened(null);

  return (
    <section id="cases" className="section cases-sectionPad">
      <div className="container">
        <div className="cases-titleBlock">
          <h2 className="sectionHead">
            <span className="cases-green">99%</span> дел завершено успешно
          </h2>
          <p className="sectionLead">
            1% — это отказы клиентов от процедуры из-за найденных средств или изменившихся обстоятельств.
          </p>
        </div>

        <div className="cases-slider">
          <div ref={viewportRef} className="cases-viewport" aria-live="polite">
            <div className="cases-track">
              {DATA.map((it) => (
                <article key={it.id} className="cases-card cases-cardCenter">
                  <header className="cases-cardHead">
                    <div className="cases-avatar" aria-hidden>👤</div>
                    <div className="cases-name">{it.name}</div>
                    <div className="cases-stars" aria-label="Рейтинг 5 из 5">★★★★★</div>
                  </header>

                  <div className="cases-badges">
                    <span className="cases-badgeGreen">Списали: <b>{it.amount}</b></span>
                    <span className="cases-badgeCase">Номер дела: <b>{it.caseNo}</b></span>
                  </div>

                  <p className="cases-text">{it.preview}</p>

                  <button className="cases-more" onClick={() => setOpened(it)}>
                    Читать полностью →
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="cases-arrows" aria-hidden>
            <button
              className="cases-arrow cases-arrowLeft"
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              aria-label="Назад"
            >‹</button>
            <button
              className="cases-arrow cases-arrowRight"
              onClick={() => goTo(page + 1)}
              disabled={page >= pages - 1}
              aria-label="Вперёд"
            >›</button>
          </div>

          <div className="cases-dots" role="tablist" aria-label="Страницы отзывов">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === page}
                className={`cases-dot ${i === page ? "cases-dotActive" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Лёгкая модалка без внешних зависимостей */}
      {opened && (
        <div
          className="cases-modalOverlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cases-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="cases-modal">
            <div className="cases-modalHead">
              <h3 id="cases-dialog-title" className="cases-modalTitle">{opened.name}</h3>
              <button className="cases-modalClose" aria-label="Закрыть" onClick={closeModal}>×</button>
            </div>

            <div className="cases-fullMeta">
              <span className="cases-badgeGreen">Списали: <b>{opened.amount}</b></span>
              <span className="cases-badgeCase">Номер дела: <b>{opened.caseNo}</b></span>
            </div>

            <p style={{ marginTop: 10, lineHeight: 1.6 }}>{opened.full}</p>

            <div className="cases-modalFooter">
              <button className="btn btn-primary" onClick={closeModal}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}