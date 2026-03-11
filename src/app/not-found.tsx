import Link from "next/link";
import type { Metadata } from "next";
import "@styles/NotFoundPage.css";

export const metadata: Metadata = {
  title: "Страница не найдена — 404",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="nf">
      <div className="container nf__inner">
        <div className="nf__num" aria-hidden="true">404</div>
        <h1 className="nf__title">Страница не найдена</h1>
        <p className="nf__desc">
          Возможно, страница была перемещена или удалена.<br />
          Вернитесь на главную и начните снова.
        </p>
        <div className="nf__actions">
          <Link href="/" className="nf__btn nf__btn--primary">На главную</Link>
          <Link href="/faq" className="nf__btn nf__btn--outline">Вопросы и ответы</Link>
        </div>
        <p className="nf__hint">
          Или воспользуйтесь&nbsp;<Link href="/sitemap">картой сайта</Link>
        </p>
      </div>
    </div>
  );
}