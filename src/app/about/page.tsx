import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the framework behind my notes on philosophy, behavioral psychology, perception, and exchange.",
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
          <p className="section-label">about</p>
          <h1>Mateus Cavalcanti</h1>
          <p>
            Student. I write about philosophy, behavioral psychology, and the
            frameworks people use to make life intelligible.
          </p>
        </div>
      </section>

      <section className="section section--ruled">
        <div className="container article-body">
          <p>
            This blog is where I place the results of thinking too long about
            what affects living: philosophy, behavioral psychology, and the soft
            violence of needing to matter to someone else.
          </p>
          <p>
            The central suspicion is that <em>the thought</em>{" "}that
            everything is relative is what matters most when building any
            psychological framework. &quot;What it is&quot; may matter, or may not, but that
            question is often unproductive. The question should be: &quot;Does it
            matter for them?&quot; The catalyst of a specific behavior is relative
            to what someone perceives as world, making that perceptual world the
            most productive way of studying someone.
          </p>
          <p>
            With that in mind, through thinking I have concluded that, for
            example, what looks like personality is often only a private economy
            with better manners, reducing almost everything to a form of
            exchange.
          </p>
          <p>
            Although mentioned as conclusions, I get to no real final answer,
            but only dated attempts to preserve the shape of a question before
            it changes its face again.
          </p>
          <p>
            Either way, the biggest irony stands: an attempt to build a
            framework for understanding others through my own perceptual world,
            and the framework is an almost perfect self-portrait.
          </p>
          <p>
            <Link className="button button--ghost" href="/archive">
              archive
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
