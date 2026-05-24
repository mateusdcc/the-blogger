import Link from "next/link";
import { SearchArchive } from "@/components/search-archive";
import { getAllPosts } from "@/lib/posts";
import { formatPostDate } from "@/lib/post-utils";

export default function Home() {
  const posts = getAllPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const remaining = posts.filter((post) => post.slug !== featured?.slug).slice(0, 3);

  return (
    <main>
      <section className="hero scanlines">
        <SiteNav />
        <div className="hero__inner">
          <p className="section-label">student / behavioral psychology / philosophy</p>
          <h1>
            <em>everything</em>
            {" "}
            <span>is an exchange</span>
          </h1>
          <p className="hero__copy">
            Mateus Cavalcanti keeps a record of the small markets inside the
            self: attention, narcissism, bad faith, desire, debt, the need to be
            seen, and the price paid for being seen too clearly.
          </p>
          <div className="hero__actions" aria-label="Primary navigation">
            <Link className="button button--primary" href="/archive">
              the accumulated record
            </Link>
            <Link className="button button--void" href="/about">
              or don&apos;t
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="section-label">latest evidence, if that word still holds</p>
          {featured ? (
            <article className="featured-post">
              <div>
                <p className="meta">{formatPostDate(featured.date)}</p>
                <h2>
                  <Link href={`/posts/${featured.slug}`}>{featured.title}</Link>
                </h2>
              </div>
              <p>{featured.excerpt}</p>
              <Link className="button button--ghost" href={`/posts/${featured.slug}`}>
                continue if you must
              </Link>
            </article>
          ) : (
            <p className="empty-state">Nothing has been written. This is not unusual.</p>
          )}
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container">
          <p className="section-label">recent fragments pretending to cohere</p>
          <div className="post-list">
            {remaining.map((post) => (
              <article className="post-card" key={post.slug}>
                <p className="meta">{formatPostDate(post.date)}</p>
                <h3>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
                <div className="post-card__footer">
                  <span>{post.category}</span>
                  <span>{post.readingTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container">
          <p className="section-label">search, as a private superstition</p>
          <SearchArchive posts={posts} compact />
        </div>
      </section>
    </main>
  );
}

function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site">
      <Link href="/" aria-label="Mateus Cavalcanti home">
        MC
      </Link>
      <div>
        <Link href="/archive">archive</Link>
        <Link href="/about">about</Link>
      </div>
    </nav>
  );
}
