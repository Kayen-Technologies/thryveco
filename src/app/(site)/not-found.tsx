import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="mb-4 text-sm uppercase tracking-[var(--tracking-caps)] text-[var(--color-text-muted)]">
        404
      </p>
      <h1 className="font-heading mb-4 text-[var(--text-h1)]">Page not found</h1>
      <p className="mb-8 max-w-md text-[var(--color-text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-[50px] items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-8 text-sm font-semibold text-[var(--color-text-on-dark)]"
      >
        Back to home
      </Link>
    </main>
  );
}
