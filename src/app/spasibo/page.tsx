import Link from "next/link";
import type { Metadata } from "next";
import SpasiboTracker from "./SpasiboTracker";
import "@styles/SpasiboPage.css";

export const metadata: Metadata = {
  title: "Спасибо за заявку!",
  robots: { index: false },
};

export default function SpasiboPage() {
  return (
    <>
      <SpasiboTracker />
      <div className="spasibo">
        <div className="container spasibo__inner">
          <div className="spasibo__icon" aria-hidden="true">✅</div>
          <h1 className="spasibo__title">Заявка отправлена!</h1>
          <p className="spasibo__text">
            Наш специалист свяжется с вами по указанному номеру телефона в течение{" "}
            <strong>10–15 минут</strong> в рабочее время (9:00–20:00 МСК).
          </p>
          <p className="spasibo__sub">Пока ждёте — читайте полезные статьи:</p>
          <div className="spasibo__links">
            <Link href="/blog/chto-takoe-bankrotstvo-fizicheskih-lic/">
              Что такое банкротство физических лиц
            </Link>
            <Link href="/blog/posledstviya-bankrotstva-mify-i-realnost/">
              Последствия банкротства: мифы и реальность
            </Link>
            <Link href="/faq/">
              Частые вопросы и ответы
            </Link>
          </div>
          <Link href="/" className="spasibo__back">← На главную</Link>
        </div>
      </div>
    </>
  );
}