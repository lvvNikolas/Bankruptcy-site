import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",

  typedRoutes: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  // ✅ ВАЖНО для хостинга со статикой
  trailingSlash: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;