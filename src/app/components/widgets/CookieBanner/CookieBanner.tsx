"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import "@styles/CookieBanner.css";

const POLICY_URL = "/politika-konfidentsialnosti" as Route;

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-bar" role="region" aria-label="Уведомление об использовании cookie">
      <p className="cookie-bar__text">
        Мы используем файлы cookie для улучшения вашего опыта на сайте.
        Оставаясь на нашем сайте, вы{" "}
        <Link href={POLICY_URL} className="cookie-bar__link">
          соглашаетесь с использованием файлов cookie
        </Link>
        . Запретить эти действия можно в настройках браузера.
      </p>
      <button className="cookie-bar__btn" onClick={accept}>
        Принять
      </button>
    </div>
  );
}