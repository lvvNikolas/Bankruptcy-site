"use client";

import "@styles/Account.css"; // (если захочешь отдельные стили)

export default function AccountPage() {
  return (
    <main className="account-page">
      <div className="container">
        <h1 className="account-title">Личный кабинет</h1>
        <p className="account-lead">
          Добро пожаловать! Здесь будет размещена панель управления, история обращений
          и персональные документы.
        </p>

        <div className="account-box">
          <p>⚙️ Раздел в разработке.</p>
        </div>
      </div>
    </main>
  );
}