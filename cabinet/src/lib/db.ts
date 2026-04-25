import { PrismaClient } from "@prisma/client";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";

// PrismaNeonHTTP отправляет каждый запрос через HTTP — не держит TCP-соединение,
// поэтому работает даже когда Neon compute "спит" (решает E57P01 / Can't reach server)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeonHTTP(process.env.DATABASE_URL!, {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
