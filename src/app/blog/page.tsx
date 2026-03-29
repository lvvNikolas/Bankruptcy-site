import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/app/data/blog";
import BlogSearchClient from "./BlogSearchClient";
import "@styles/BlogPage.css";
import { SITE_URL } from "@/config";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Блог",
  description:
    "Полезные статьи о банкротстве физических лиц: как списать долги, последствия процедуры, пошаговые инструкции по 127-ФЗ.",
  openGraph: {
    title: "Блог о банкротстве | Юридическое агентство по банкротству Солюшен",
    description: "Полезные статьи о банкротстве физических лиц по 127-ФЗ.",
    type: "website",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630 }],
  },
};

export default function BlogPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog/` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Блог Юридическое агентство по банкротству Солюшен",
      url: `${SITE_URL}/blog/`,
      blogPost: BLOG_POSTS.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.dateIso,
        url: `${SITE_URL}/blog/${post.slug}/`,
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="blog-hero">
        <div className="container">
          <nav className="blog-crumbs" aria-label="Хлебные крошки">
            <ol>
              <li><Link href="/">Главная</Link></li>
              <li aria-current="page">Блог</li>
            </ol>
          </nav>
          <div className="blog-hero__content">
            <p className="blog-hero__eyebrow">Полезные материалы</p>
            <h1 className="blog-hero__title">
              Блог о <span>банкротстве</span>
            </h1>
            <p className="blog-hero__lead">
              Разбираем банкротство физических лиц: законы, процедуры, мифы и реальные кейсы.
            </p>
            <div className="blog-hero__stats">
              <div className="blog-hero__stat">
                <span className="blog-hero__stat-num">{BLOG_POSTS.length}</span>
                <span className="blog-hero__stat-label">статьи</span>
              </div>
              <div className="blog-hero__stat">
                <span className="blog-hero__stat-num">127-ФЗ</span>
                <span className="blog-hero__stat-label">актуальная практика</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="blog-section">
        <div className="container">
          <Suspense fallback={null}>
            <BlogSearchClient posts={BLOG_POSTS} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
