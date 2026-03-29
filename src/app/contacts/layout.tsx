import type { Metadata } from "next";
import { SITE_URL, PHONE_RAW, EMAIL } from "@/config";

export const metadata: Metadata = {
  alternates: { canonical: "/contacts" },
  title: "Контакты — Юридическое агентство по банкротству Солюшен",
  description:
    "Позвоните, напишите или приезжайте в офис. Бесплатная консультация по списанию долгов по 127-ФЗ. Москва, Пресненская набережная, д. 12.",
  openGraph: {
    title: "Контакты — Юридическое агентство по банкротству Солюшен",
    description:
      "Бесплатная консультация по списанию долгов. Москва, Пресненская набережная, д. 12.",
    type: "website",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Контакты Юридическое агентство по банкротству Солюшен",
  url: `${SITE_URL}/contacts/`,
  description: "Контактная информация юридической компании Юридическое агентство по банкротству Солюшен по вопросам банкротства физических лиц",
  mainEntity: {
    "@type": "LegalService",
    name: "Юридическое агентство по банкротству Солюшен",
    url: SITE_URL,
    telephone: PHONE_RAW,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Пресненская набережная, д. 12",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
  },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
