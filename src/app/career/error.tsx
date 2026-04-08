"use client";

// Error boundary для сегмента /career
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function CareerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="карьера" />;
}
