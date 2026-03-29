"use client";

/**
 * GoalTracker — отслеживает микро-конверсии через делегирование событий.
 * Не рендерит DOM-элементов. Работает через один глобальный слушатель.
 *
 * Цели Яндекс.Метрики:
 *   phone_click       — клик по номеру телефона
 *   whatsapp_click    — переход в WhatsApp
 *   telegram_click    — переход в Telegram
 *   quiz_started      — пользователь открыл квиз
 *   calculator_used   — пользователь использовал калькулятор
 */

import { useEffect } from "react";
import { METRIKA_ID } from "@/config";

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
  }
}

function fireGoal(goal: string) {
  try {
    window.ym?.(METRIKA_ID, "reachGoal", goal);
  } catch {}
}

export default function GoalTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        fireGoal("phone_click");
        return;
      }
      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        fireGoal("whatsapp_click");
        return;
      }
      if (href.includes("t.me") || href.includes("telegram.me")) {
        fireGoal("telegram_click");
        return;
      }

      // Клик по кнопке "Узнать стоимость" (квиз) или якорю #quiz
      if (href === "#quiz" || href.endsWith("/#quiz")) {
        fireGoal("quiz_started");
        return;
      }

      // Переход на страницу калькулятора
      if (href.includes("/calculator")) {
        fireGoal("calculator_used");
      }
    }

    document.addEventListener("click", handleClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
