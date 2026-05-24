import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "On The Author's Uncertain Existence",
  description:
    "About Mateus Cavalcanti, a student writing about behavioral psychology, philosophy, attention, and exchange.",
};

export default function AboutPage() {
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
          <p className="section-label">on the author&apos;s uncertain existence</p>
          <h1>Mateus Cavalcanti</h1>
          <p>
            Student. Observer of exchanges. Currently suspicious of every clean
            explanation, especially the ones that make people feel finished.
          </p>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container article-body">
          <p>
            This blog is where I place the results of thinking too long about
            behavioral psychology, philosophy, narcissism, attention, desire,
            self-deception, and the soft violence of needing to matter to
            someone else.
          </p>
          <p>
            The central suspicion is simple enough to be dangerous: everything
            is an exchange. Attention is traded for identity. Certainty is
            traded for belonging. Even solitude asks for payment, and usually
            collects with interest.
          </p>
          <blockquote>
            <p>
              What looks like personality is often only a private economy with
              better manners.
            </p>
          </blockquote>
          <p>
            These are not final answers. They are dated attempts to preserve the
            shape of a question before it changes its face again.
          </p>
          <p>
            <Link className="button button--ghost" href="/archive">
              back to uncertainty
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
