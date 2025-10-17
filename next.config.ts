import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Включаем строгий режим React (рекомендуется)
  reactStrictMode: true,

  // Экспорт полностью статического сайта (аналог vite build)
  output: "export",

  // Глобальные алиасы (если используешь tsconfig с "@/...")
  experimental: {
    typedRoutes: true,
  },

  // Настройки изображений
  images: {
    unoptimized: true, // важно для "next export"
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },

  // Чтобы не добавлял лишний слэш (пример: /faq вместо /faq/)
  trailingSlash: false,

  // Оптимизация сборки
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Поддержка Sass, если используешь .scss
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;