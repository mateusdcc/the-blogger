import type { Metadata } from "next";
import Link from "next/link";
import { SearchArchive } from "@/components/search-archive";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "My posts on philosophy, behavioral psychology, perception, attention, and exchange.",
};

export default function ArchivePage() {
  const posts = getAllPosts();

  return (
    <main>
      <section className="page-hero scanlines">
        <nav className="site-nav" aria-label="Site">
          <Link href="/">MC</Link>
          <div>
            <Link href="/archive">archive</Link>
            <Link href="/about">about</Link>
          </div>
        </nav>
        <div className="container">
          <p className="section-label">all posts</p>
          <h1>archive</h1>
          <p>
            Essays, notes, results, and unfinished arguments, arranged by date.
          </p>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container">
          <SearchArchive posts={posts} />
        </div>
      </section>
    </main>
  );
}
