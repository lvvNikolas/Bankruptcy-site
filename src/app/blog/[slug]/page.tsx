import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/app/data/blog";
import Quiz from "@/app/components/sections/Quiz/Quiz";
import ReadingProgress from "@/app/components/widgets/ReadingProgress/ReadingProgress";
import "@styles/BlogPostPage.css";

const SITE_URL = "https://basolution.ru";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.dateIso,
      images: [{ url: "/og-preview.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog/` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}/` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.dateIso,
      author: {
        "@type": "Organization",
        name: "Юридическое агентство по банкротству Солюшен",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Юридическое агентство по банкротству Солюшен",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/${post.slug}/`,
      },
    },
  ];

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="post-hero">
        <div className="container">
          <nav className="post-crumbs" aria-label="Хлебные крошки">
            <ol>
              <li><Link href={"/" as Route}>Главная</Link></li>
              <li><Link href={"/blog/" as Route}>Блог</Link></li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <span className="post-category">{post.category}</span>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <time dateTime={post.dateIso}>{post.date}</time>
            <span className="post-meta__dot" aria-hidden="true" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <article className="post-body">
        <div className="container post-content">
          <p className="post-intro">{post.intro}</p>
          {post.sections.map((section, i) => (
            <div key={i} className="post-section">
              {section.heading && (
                <h2 className="post-section__heading">{section.heading}</h2>
              )}
              <p className="post-section__text">{section.content}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="post-back container">
        <Link href={"/blog/" as Route} className="post-back__link">← Все статьи</Link>
      </div>

      <Quiz />
    </>
  );
}
