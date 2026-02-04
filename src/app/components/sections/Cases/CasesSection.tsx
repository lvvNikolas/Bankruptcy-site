"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import LeadForm from "@components/LeadForm/LeadForm";
import "@styles/CasesSection.css";
import { CASES } from "@data/cases";

type LightboxItem = { src: string; alt?: string };

type LightboxState = {
  open: boolean;
  items: LightboxItem[];
  index: number;
};

export default function CasesSection() {
  const [lightbox, setLightbox] = useState<LightboxState>({
    open: false,
    items: [],
    index: 0,
  });

  const [showForm, setShowForm] = useState(false);

  const openLightbox = useCallback((items: LightboxItem[], index = 0) => {
    if (!items.length) return;
    setLightbox({ open: true, items, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((s) => ({ ...s, open: false }));
  }, []);

  const prev = useCallback(() => {
    setLightbox((s) => {
      if (!s.items.length) return s;
      return {
        ...s,
        index: (s.index - 1 + s.items.length) % s.items.length,
      };
    });
  }, []);

  const next = useCallback(() => {
    setLightbox((s) => {
      if (!s.items.length) return s;
      return {
        ...s,
        index: (s.index + 1) % s.items.length,
      };
    });
  }, []);

  const onOpenForm = useCallback(() => setShowForm(true), []);
  const onCloseForm = useCallback(() => setShowForm(false), []);

  // Esc — закрыть лайтбокс и форму
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox.open) closeLightbox();
      if (showForm) onCloseForm();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox.open, showForm, closeLightbox, onCloseForm]);

  // Лочим скролл, когда открыта форма
  useEffect(() => {
    if (!showForm) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showForm]);

  return (
    <section id="cases" className="cases">
      <div className="container">
        {/* Заголовок секции */}
        <header className="cases__head">
          <p className="cases__eyebrow">Реальные истории клиентов</p>
          <h2 className="cases__title">Выигранные дела и списанные долги</h2>
          <p className="cases__lead">
            Кратко и по делу: откуда клиент пришёл, какая была ситуация и к
            какому результату мы его привели. Все кейсы подтверждены судебными
            актами.
          </p>
        </header>

        {/* Сетка кейсов */}
        <div className="cases__grid">
          {CASES.map((c) => {
            const mainDoc = c.docs[0];
            const isPdf = mainDoc?.src.toLowerCase().endsWith(".pdf") ?? false;

            return (
              <article key={c.id} className="case">
                {/* Левая колонка — текст */}
                <div className="case__info">
                  <div className="case__personRow">
                    <span className="case__avatar" aria-hidden="true" />
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
                      <div className="case__cardLabel">№ дела в суде</div>
                      <div className="case__cardValue">{c.caseNo}</div>
                    </div>
                    <div className="case__card">
                      <div className="case__cardLabel">Срок рассмотрения</div>
                      <div className="case__cardValue">{c.term}</div>
                    </div>
                  </div>

                  <div className="case__creditors">
                    <div className="case__cardLabel">Список кредиторов</div>
                    <div className="case__creditorsList">{c.creditors}</div>
                  </div>
                </div>

                {/* Правая колонка — документ / PDF */}
                <div className="case__docs">
                  {mainDoc ? (
                    <button
                      type="button"
                      className="case__docMain"
                      onClick={() => openLightbox(c.docs, 0)}
                      aria-label={isPdf ? "Открыть PDF документ" : "Открыть изображение документа"}
                    >
                      {isPdf ? (
                        <div className="case__docPdf">
                          <div className="case__docPdfIcon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 2H6v16h12V9h-4a1 1 0 0 1-1-1V4Zm1 11h-6v2h6v-2Z" />
                            </svg>
                          </div>
                          <div className="case__docPdfText">
                            <span className="case__docPdfTitle">
                              Судебное определение (PDF)
                            </span>
                            <span className="case__docPdfHint">
                              Нажмите, чтобы открыть документ
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={mainDoc.src}
                            alt={mainDoc.alt ?? "Скан судебного определения"}
                            width={920}
                            height={1300}
                            className="case__docMainImg"
                          />
                          <span className="case__docZoom" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19l-5-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="cases__cta">
          <button
            type="button"
            className="btn btn-primary cases__ctaBtn"
            onClick={onOpenForm}
          >
            <svg className="cases__ctaIcon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
            </svg>
            Быстрая консультация по&nbsp;вашему делу
          </button>
        </div>
      </div>

      {/* Лайтбокс документов */}
      {lightbox.open && lightbox.items.length > 0 && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр документа"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            className="lb__nav lb__nav--prev"
            aria-label="Предыдущий документ"
            onClick={prev}
          >
            ‹
          </button>

          <figure className="lb__figure">
            {(() => {
              const current = lightbox.items[lightbox.index];
              const currentIsPdf = current.src.toLowerCase().endsWith(".pdf");

              if (currentIsPdf) {
                return (
                  <iframe
                    src={current.src}
                    title={current.alt ?? "PDF документ"}
                    className="lb__frame"
                  />
                );
              }

              return (
                <Image
                  src={current.src}
                  alt={current.alt ?? "Документ"}
                  width={1100}
                  height={1560}
                  className="lb__img"
                />
              );
            })()}
          </figure>

          <button
            type="button"
            className="lb__nav lb__nav--next"
            aria-label="Следующий документ"
            onClick={next}
          >
            ›
          </button>

          <button
            type="button"
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
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseForm();
          }}
        >
          <div className="casesForm">
            <div className="casesForm__top">
              <h3 id="cases-form-title" className="casesForm__title">
                Оставьте контакты — юрист свяжется в течение 15 минут
              </h3>
              <button
                type="button"
                className="casesForm__close"
                aria-label="Закрыть форму"
                onClick={onCloseForm}
              >
                ×
              </button>
            </div>

            <LeadForm
              formId="cases_cta"
              context="cases"
              onSuccess={onCloseForm}
            />
          </div>
        </div>
      )}
    </section>
  );
}