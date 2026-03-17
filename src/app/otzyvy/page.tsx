import type { Metadata } from "next";
import ReviewsSection from "@/app/components/sections/ReviewsSection/ReviewsSection";
import { REVIEWS } from "@/app/data/reviews";

const SITE_URL = "https://basolution.ru";

export const metadata: Metadata = {
  alternates: { canonical: "/otzyvy" },
  title: "Отзывы клиентов",
  description:
    "Реальные отзывы клиентов о банкротстве физических лиц в Юридическом агентстве по банкротству Солюшен. Более 500 успешных дел по всей России.",
  openGraph: {
    title: "Отзывы клиентов | Юридическое агентство по банкротству Солюшен",
    description:
      "Реальные отзывы о банкротстве физических лиц. Более 500 успешных дел, оценка 4.9 из 5.",
    type: "website",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Отзывы клиентов — Юридическое агентство по банкротству Солюшен",
  url: `${SITE_URL}/otzyvy/`,
  itemListElement: REVIEWS.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.stars,
        bestRating: 5,
      },
      author: {
        "@type": "Person",
        name: r.name,
      },
      reviewBody: r.text,
      itemReviewed: {
        "@type": "LegalService",
        name: "Юридическое агентство по банкротству Солюшен",
        url: SITE_URL,
      },
    },
  })),
};

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewsSection />
    </>
  );
}
