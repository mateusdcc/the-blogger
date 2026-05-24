import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container">
        <p className="section-label">404</p>
        <h1>this page, like most things, does not exist</h1>
        <Link className="button button--ghost" href="/">
          return to wherever this began
        </Link>
      </div>
    </main>
  );
}
