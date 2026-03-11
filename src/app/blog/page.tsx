import type { Metadata, Route } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/app/data/blog";
import "@styles/BlogPage.css";

const SITE_URL = "https://basolution.ru";

export const metadata: Metadata = {
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
  const [featured, ...rest] = BLOG_POSTS;

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
      name: "Блог Юридическое агентство по банкротству Солюшен — банкротство физических лиц",
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

          {/* Главная статья */}
          <article className="blog-featured" data-category={featured.category}>
            <div className="blog-featured__body">
              <span className="blog-featured__label">{featured.category}</span>
              <h2 className="blog-featured__title">
                <Link href={`/blog/${featured.slug}/` as Route}>{featured.title}</Link>
              </h2>
              <p className="blog-featured__excerpt">{featured.intro}</p>
              <div className="blog-featured__meta">
                <time dateTime={featured.dateIso}>{featured.date}</time>
                <span className="blog-featured__dot" aria-hidden="true" />
                <span>{featured.readTime}</span>
              </div>
              <Link href={`/blog/${featured.slug}/` as Route} className="blog-featured__link">
                Читать статью →
              </Link>
            </div>
            <div className="blog-featured__aside" aria-hidden="true">
              <span className="blog-featured__num">01</span>
            </div>
          </article>

          {/* Остальные статьи */}
          <ul className="blog-grid">
            {rest.map((post, i) => (
              <li key={post.slug} className="blog-card" data-category={post.category}>
                <div className="blog-card__header">
                  <span className="blog-card__category">{post.category}</span>
                  <span className="blog-card__num">0{i + 2}</span>
                </div>
                <h2 className="blog-card__title">
                  <Link href={`/blog/${post.slug}/` as Route}>{post.title}</Link>
                </h2>
                <p className="blog-card__excerpt">{post.intro}</p>
                <div className="blog-card__meta">
                  <time dateTime={post.dateIso}>{post.date}</time>
                  <span className="blog-card__dot" aria-hidden="true" />
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}/` as Route} className="blog-card__link">
                  Читать статью →
                </Link>
              </li>
            ))}
          </ul>

        </div>
      </section>
    </>
  );
}