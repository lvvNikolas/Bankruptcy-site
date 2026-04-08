"use client";

// Error boundary для сегмента /cases
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function CasesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="выигранные дела" />;
}
