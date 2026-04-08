import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Кабинет — серверное приложение, статический экспорт не нужен
  // Деплоится на Vercel с поддержкой SSR и API routes

  compiler: {
    // Убираем console.log в продакшне (console.error оставляем для ошибок)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error"] }
      : false,
  },
};

export default nextConfig;
