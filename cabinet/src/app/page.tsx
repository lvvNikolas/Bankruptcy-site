// Корневой роут — редирект на нужный дашборд в зависимости от роли.
// Middleware уже защищает роуты, здесь просто определяем куда идти.
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RootPage() {
  const session = await auth();

  if (!session) redirect("/login");

  // ADMIN → панель администратора, CLIENT → личный кабинет
  redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
}
