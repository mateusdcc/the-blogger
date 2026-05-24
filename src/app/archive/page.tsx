import type { Metadata } from "next";
import Link from "next/link";
import { SearchArchive } from "@/components/search-archive";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "The Accumulated Record",
  description:
    "All posts by Mateus Cavalcanti on behavioral psychology, philosophy, attention, and recursive doubt.",
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
          <p className="section-label">all posts, reluctantly arranged</p>
          <h1>the accumulated record</h1>
          <p>
            A ledger of essays, notes, results, unfinished arguments, and the
            occasional proposition that survived long enough to be given a date.
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
