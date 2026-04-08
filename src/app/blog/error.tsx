"use client";

// Error boundary для сегмента /blog
// Изолирует ошибки блога от остальных разделов сайта
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="блог" />;
}
