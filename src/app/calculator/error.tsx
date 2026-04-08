"use client";

// Error boundary для сегмента /calculator
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function CalculatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="калькулятор" />;
}
