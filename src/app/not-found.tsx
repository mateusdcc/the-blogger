import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container">
        <p className="section-label">404</p>
        <h1>page not found</h1>
        <Link className="button button--ghost" href="/">
          home
        </Link>
      </div>
    </main>
  );
}
