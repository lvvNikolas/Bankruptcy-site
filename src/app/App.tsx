// src/app/App.tsx
import { Suspense } from "react"
import { useRoutes } from "react-router-dom"

import Shell from "@app/layout/Shell"
import ScrollToTop from "@app/router/ScrollToTop"
import { ToastProvider } from "@shared/ui/Toast/ToastProvider"

// Страницы
import Home from "@pages/Home/Home"
import Services from "@pages/Services/Services"
import Process from "@pages/Process/Process"
import Prices from "@pages/Prices/Prices"
import FAQ from "@pages/FAQ/FAQ"
import Contacts from "@pages/Contacts/Contacts"

/** Фолбэк для несуществующих маршрутов (404) */
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
  )
}

export default function App() {
  /** Роутинг приложения */
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/uslugi", element: <Services /> },
    { path: "/process", element: <Process /> },
    { path: "/ceny", element: <Prices /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/kontakty", element: <Contacts /> },
    { path: "*", element: <NotFound /> }, // 404
  ])

  return (
    <ToastProvider>
      <Shell>
        {/* Следим за изменением маршрута и скроллим вверх */}
        <ScrollToTop />

        {/* Suspense нужен для lazy-страниц (если подключишь React.lazy) */}
        <Suspense fallback={<div className="container">Загрузка...</div>}>
          {routes}
        </Suspense>
      </Shell>
    </ToastProvider>
  )
}