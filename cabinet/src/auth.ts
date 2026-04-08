import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

// ─── Схема валидации логина ────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

// ─── NextAuth конфигурация ────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  // Используем JWT сессии (stateless) — не требует хранения в БД
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login", // кастомная страница входа
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Пароль",   type: "password" },
      },

      async authorize(credentials) {
        // Валидируем входные данные
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Ищем пользователя в БД
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        // Проверяем пароль
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        // Возвращаем объект пользователя (попадёт в JWT токен)
        return {
          id:    user.id,
          email: user.email,
          name:  user.name ?? undefined,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Добавляем role в JWT токен
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },

    // Добавляем role и id в сессию (доступны на клиенте)
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

// ─── Расширяем типы NextAuth ──────────────────────────────────────────────────

declare module "next-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: {
      id:    string;
      email: string;
      name?: string;
      role:  string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:   string;
    role: string;
  }
}
