// src/app/App.tsx
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import Shell from "@app/layout/Shell";
import ScrollToTop from "@app/router/ScrollToTop";
import { ToastProvider } from "@shared/ui/Toast/ToastProvider";
import ScrollTopButton from "@shared/ui/ScrollTopButton/ScrollTopButton"; // ← кнопка «вверх»

// Страницы
import Home from "@pages/Home/Home";
import Services from "@pages/Services/Services";
import Process from "@pages/Process/Process";
import Prices from "@pages/Prices/Prices";
import FAQ from "@pages/FAQ/FAQ";
import Contacts from "@pages/Contacts/Contacts";
import Debts from "@/pages/Debts/Debts";

/** 404 */
function NotFound() {
  return (
    <div className="section">
      <div className="container">
        <h2 className="sectionHead">Страница не найдена</h2>
        <p className="sectionLead">
          Проверьте адрес или вернитесь <a href="/">на главную</a>.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // Маршруты
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/uslugi", element: <Services /> },
    { path: "/process", element: <Process /> },
    { path: "/ceny", element: <Prices /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/kontakty", element: <Contacts /> },
    {path: "/dolgi", element: <Debts /> },
    { path: "*", element: <NotFound /> }, // 404
  ]);

  return (
    <ToastProvider>
      <Shell>
        {/* Скролл к началу при смене маршрута */}
        <ScrollToTop />

        {/* Глобальная кнопка «вверх» (слева), не конфликтует с вашей кнопкой заявки справа */}
        <ScrollTopButton />

        {/* Suspense на случай ленивых страниц */}
        <Suspense fallback={<div className="container">Загрузка...</div>}>
          {routes}
        </Suspense>
      </Shell>
    </ToastProvider>
  );
}