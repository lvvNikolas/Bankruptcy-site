"use client";

import { useEffect } from "react";
import { METRIKA_ID } from "@/config";

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
  }
}

export default function SpasiboTracker() {
  useEffect(() => {
    try {
      window.ym?.(METRIKA_ID, "reachGoal", "form_submitted");
    } catch {}
  }, []);
  return null;
}