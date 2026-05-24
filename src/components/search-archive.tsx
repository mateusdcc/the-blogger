"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPostDate, type PostMeta } from "@/lib/post-utils";

type SearchArchiveProps = {
  posts: PostMeta[];
  compact?: boolean;
};

export function SearchArchive({ posts, compact = false }: SearchArchiveProps) {
  const [query, setQuery] = useState("");
  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return compact ? posts.slice(0, 4) : posts;
    }

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.subtitle,
        post.category,
        post.excerpt,
        post.tags.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [compact, posts, query]);

  return (
    <div className="archive-search">
      <label className="sr-only" htmlFor="post-search">
        Search posts
      </label>
      <input
        id="post-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="search posts"
      />

      <div className="archive-results" aria-live="polite">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article className="archive-row" key={post.slug}>
              <p className="meta">{formatPostDate(post.date)}</p>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <div className="archive-row__meta">
                <span>{post.category}</span>
                <span>{post.readingTime}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">No matching posts.</p>
        )}
      </div>
    </div>
  );
}
