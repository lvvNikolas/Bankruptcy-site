import { PrismaClient } from "@prisma/client";

// Синглтон Prisma Client — предотвращает создание множества подключений
// в режиме разработки из-за hot-reload Next.js

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
