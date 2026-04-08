"use client";

// Error boundary для сегмента /otzyvy
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function OtzyvyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="отзывы" />;
}
