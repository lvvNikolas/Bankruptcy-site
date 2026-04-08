"use client";

// Error boundary для сегмента /faq
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function FaqError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="раздел FAQ" />;
}
