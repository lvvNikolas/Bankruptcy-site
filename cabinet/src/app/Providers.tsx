"use client";

import { SessionProvider } from "next-auth/react";
import { SessionGuard } from "./SessionGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <SessionGuard />
    </SessionProvider>
  );
}
