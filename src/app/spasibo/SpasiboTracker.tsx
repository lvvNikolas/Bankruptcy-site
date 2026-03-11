"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
  }
}

export default function SpasiboTracker() {
  useEffect(() => {
    try {
      window.ym?.(107006423, "reachGoal", "form_submitted");
    } catch {}
  }, []);
  return null;
}