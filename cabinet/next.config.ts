import type { NextConfig } from "next";

const securityHeaders = [
  // Запрет отображения сайта во фрейме (защита от clickjacking)
  { key: "X-Frame-Options",           value: "DENY" },
  // Запрет MIME-sniffing браузером
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Referrer только для своего домена
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Запрет доступа к камере/микрофону/геолокации
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  // HTTPS принудительно (1 год, включая поддомены)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-* нужен для Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.vercel-storage.com",
      "font-src 'self'",
      "connect-src 'self' https://*.vercel-storage.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Пакеты которые должны оставаться на сервере (не бандлиться Turbopack)
  serverExternalPackages: ["nodemailer"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error"] }
      : false,
  },
};

export default nextConfig;
