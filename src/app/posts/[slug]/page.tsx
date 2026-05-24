import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from "@/lib/posts";
import { formatPostDate } from "@/lib/post-utils";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const adjacent = getAdjacentPosts(slug);

  return (
    <main>
      <article className="post-shell">
        <nav className="site-nav site-nav--post" aria-label="Site">
          <Link href="/">MC</Link>
          <div>
            <Link href="/archive">archive</Link>
            <Link href="/about">about</Link>
          </div>
        </nav>

        <header className="post-header scanlines">
          <div className="container">
            <p className="section-label">{post.category}</p>
            <p className="meta">{formatPostDate(post.date)}</p>
            <h1>{post.title}</h1>
            {post.subtitle ? <p className="post-subtitle">{post.subtitle}</p> : null}
            <p className="post-time">{post.readingTime}</p>
          </div>
        </header>

        <div className="container post-content">
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        <footer className="container post-footer">
          {adjacent.previous ? (
            <Link href={`/posts/${adjacent.previous.slug}`}>
              <span>previous</span>
              {adjacent.previous.title}
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link href={`/posts/${adjacent.next.slug}`}>
              <span>next</span>
              {adjacent.next.title}
            </Link>
          ) : (
            <span />
          )}
        </footer>
      </article>
    </main>
  );
}
