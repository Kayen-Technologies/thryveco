import Button from "@/components/Button";

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
      <Button
        href="/"
        variant="inverse"
      >
        Back to home
      </Button>
    </main>
  );
}
