"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import type { BlogPost } from "@/app/data/blog";

const PAGE_SIZE = 6;

type Props = {
  posts: BlogPost[];
};

export default function BlogSearchClient({ posts }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const [page, setPage] = useState(1);

  const filtered = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.intro.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : posts;

  // При поиске — без пагинации; на основной странице — с пагинацией
  const paginated = query ? filtered : filtered.slice(0, page * PAGE_SIZE);
  const hasMore = !query && page * PAGE_SIZE < filtered.length;

  const [featured, ...rest] = paginated;

  return (
    <>
      {/* Результаты поиска */}
      {query && (
        <div className="blog-search-result">
          {filtered.length > 0 ? (
            <p>
              По запросу <strong>«{searchParams.get("q")}»</strong> найдено: {filtered.length}
            </p>
          ) : (
            <p>
              По запросу <strong>«{searchParams.get("q")}»</strong> ничего не найдено.{" "}
              <Link href="/blog">Показать все статьи</Link>
            </p>
          )}
        </div>
      )}

      {/* Главная статья */}
      {featured && (
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
      )}

      {/* Остальные статьи */}
      {rest.length > 0 && (
        <ul className="blog-grid">
          {rest.map((post, i) => (
            <li key={post.slug} className="blog-card" data-category={post.category}>
              <div className="blog-card__header">
                <span className="blog-card__category">{post.category}</span>
                <span className="blog-card__num">
                  {String(i + 2).padStart(2, "0")}
                </span>
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
      )}

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="btn btn-secondary"
            onClick={() => setPage((p) => p + 1)}
          >
            Загрузить ещё статьи
          </button>
        </div>
      )}
    </>
  );
}
