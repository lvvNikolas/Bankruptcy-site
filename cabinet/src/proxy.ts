import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware защиты роутов.
 *
 * Логика:
 * - Неавторизованный пользователь → редирект на /login
 * - CLIENT пытается зайти в /admin → редирект на /dashboard
 * - ADMIN на /dashboard → редирект на /admin
 * - Авторизованный на /login → редирект на нужный дашборд
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const role       = session?.user?.role;

  const isLoginPage = nextUrl.pathname === "/login";
  const isAdminPage = nextUrl.pathname.startsWith("/admin");

  // Авторизованный пользователь на странице логина → редирект на дашборд
  if (isLoggedIn && isLoginPage) {
    const dest = role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, nextUrl));
  }

  // Неавторизованный → на логин
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // CLIENT пытается зайти в /admin → на клиентский дашборд
  if (isLoggedIn && isAdminPage && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

// Применяем middleware ко всем роутам кроме статики и API auth
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
