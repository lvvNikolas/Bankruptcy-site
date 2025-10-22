"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import LeadForm from "@components/LeadForm/LeadForm";
import "@styles/CasesSection.css";

// если у тебя уже лежат данные в data/cases — оставляем импорт
import { CASES } from "@data/cases";

export default function CasesSection() {
  // лайтбокс для просмотра PDF/сканов
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    items: { src: string; alt?: string }[];
    index: number;
  }>({ open: false, items: [], index: 0 });

  // модалка с формой
  const [showForm, setShowForm] = useState(false);

  const openLightbox = (items: { src: string; alt?: string }[], index = 0) =>
    setLightbox({ open: true, items, index });

  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));
  const prev = () =>
    setLightbox((s) => ({
      ...s,
      index: (s.index - 1 + s.items.length) % s.items.length,
    }));
  const next = () =>
    setLightbox((s) => ({
      ...s,
      index: (s.index + 1) % s.items.length,
    }));

  // Esc для обоих модалок
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox.open) closeLightbox();
        if (showForm) setShowForm(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open, showForm]);

  // запрет скролла страницы, когда открыта форма
  useEffect(() => {
    if (!showForm) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showForm]);

  const onOpenForm = useCallback(() => setShowForm(true), []);
  const onCloseForm = useCallback(() => setShowForm(false), []);

  return (
    <section id="cases" className="cases">
      <div className="container">
        {/* Заголовок-слоган */}
        <header className="cases__head">
          <h2 className="cases__title">
            Выигранные дела <span className="cases__title-muted">и отзывы</span>
          </h2>
        </header>

        {/* Сетка кейсов */}
        <div className="cases__grid">
          {CASES.map((c, i) => (
            <article key={i} className="case">
              {/* Левая колонка */}
              <div className="case__info">
                <div className="case__personRow">
                  <span className="case__avatar" aria-hidden />
                  <div>
                    <div className="case__person">{c.person}</div>
                    <div className="case__city">{c.city}</div>
                  </div>
                </div>

                <p className="case__story">{c.story}</p>

                <div className="case__score">
                  <span className="case__scoreLabel">Списали:</span>
                  <span className="case__scoreValue">{c.writtenOff}</span>
                </div>

                <div className="case__cards">
                  <div className="case__card">
                    <div className="case__cardLabel">№ дела в суде:</div>
                    <div className="case__cardValue">
                      {c.caseNo}
                    </div>
                  </div>
                  <div className="case__card">
                    <div className="case__cardLabel">Срок рассмотрения:</div>
                    <div className="case__cardValue">{c.term}</div>
                  </div>
                </div>

                <div className="case__creditors">
                  <div className="case__cardLabel">Список кредиторов:</div>
                  <div className="case__creditorsList">{c.creditors}</div>
                </div>
              </div>

              {/* Правая колонка — документ */}
              <div className="case__docs">
                <button
                  type="button"
                  className="case__docMain"
                  onClick={() => openLightbox(c.docs, 0)}
                >
                  {/* превью первого документа */}
                  <Image
                    src={c.docs[0].src}
                    alt={c.docs[0].alt ?? "Скан судебного определения"}
                    width={920}
                    height={1300}
                    className="case__docMainImg"
                  />

                  {/* лупа на ховер */}
                  <span className="case__docZoom" aria-hidden>
                    <svg viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19l-5-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
                    </svg>
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA — открывает форму в модалке */}
        <div className="cases__cta">
          <button type="button" className="ctaGold" onClick={onOpenForm}>
            <svg className="ctaGold__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
            </svg>
            Быстрая консультация
          </button>
        </div>
      </div>

      {/* Лайтбокс документов */}
      {lightbox.open && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр документа"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <button
            className="lb__nav lb__nav--prev"
            aria-label="Предыдущий"
            onClick={prev}
          >
            ‹
          </button>

          <figure className="lb__figure">
            <Image
              src={lightbox.items[lightbox.index].src}
              alt={lightbox.items[lightbox.index].alt ?? "Документ"}
              width={1100}
              height={1560}
              className="lb__img"
            />
          </figure>

          <button
            className="lb__nav lb__nav--next"
            aria-label="Следующий"
            onClick={next}
          >
            ›
          </button>

          <button
            className="lb__close"
            aria-label="Закрыть просмотр"
            onClick={closeLightbox}
          >
            ×
          </button>
        </div>
      )}

      {/* Модалка с формой */}
      {showForm && (
        <div
          className="casesFormOverlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cases-form-title"
          onClick={(e) => e.target === e.currentTarget && onCloseForm()}
        >
          <div className="casesForm">
            <div className="casesForm__top">
              <h3 id="cases-form-title" className="casesForm__title">
                Оставьте контакты — перезвоним в течение 15 минут
              </h3>
              <button
                className="casesForm__close"
                aria-label="Закрыть форму"
                onClick={onCloseForm}
              >
                ×
              </button>
            </div>

            <LeadForm
              context="cases"
              onSuccess={onCloseForm}
            />
          </div>
        </div>
      )}
    </section>
  );
}