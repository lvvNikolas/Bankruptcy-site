"use client";

// Error boundary для сегмента /contacts
import SegmentError from "@/app/components/SegmentError/SegmentError";

export default function ContactsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} label="контакты" />;
}
