import Link from "next/link";
import "@styles/LoyaltyBanner.css";

export default function LoyaltyBanner() {
  return (
    <section className="lb" aria-label="Программа лояльности">
      <div className="container lb__inner">
        <div className="lb__text">
          <p className="lb__eyebrow">Партнёрская программа</p>
          <h2 className="lb__title">
            Знаете кого-то с долгами?<br />
            Заработайте <span className="lb__accent">20 000 ₽</span>
          </h2>
          <p className="lb__sub">
            Порекомендуйте нас знакомому — получите вознаграждение после заключения договора. Без сложных схем.
          </p>
        </div>

        <div className="lb__right">
          <div className="lb__stats">
            <div className="lb__stat">
              <span className="lb__stat-num">20 000 ₽</span>
              <span className="lb__stat-label">за клиента</span>
            </div>
            <div className="lb__stat-divider" aria-hidden="true" />
            <div className="lb__stat">
              <span className="lb__stat-num">3 дня</span>
              <span className="lb__stat-label">срок выплаты</span>
            </div>
            <div className="lb__stat-divider" aria-hidden="true" />
            <div className="lb__stat">
              <span className="lb__stat-num">∞</span>
              <span className="lb__stat-label">без лимита</span>
            </div>
          </div>
          <Link href="/programma-loyalnosti" className="lb__btn">
            Узнать подробнее →
          </Link>
        </div>
      </div>
    </section>
  );
}