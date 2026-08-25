export default function DecksLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-8 md:py-14" aria-busy="true">
      <div className="mb-8 space-y-4">
        <div className="h-3 w-32 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
        <div className="h-12 w-52 animate-pulse rounded-lg bg-[var(--rift-surface-raised)]" />
        <div className="h-6 max-w-md animate-pulse rounded bg-[var(--rift-surface-raised)]" />
      </div>
      <div className="mb-10 h-36 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)]" />
      <span className="sr-only">Loading your decks</span>
      <div className="mb-4 h-6 w-32 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="min-h-36 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[linear-gradient(100deg,var(--rift-surface)_30%,var(--rift-surface-raised)_50%,var(--rift-surface)_70%)] bg-[length:200%_100%]"
          />
        ))}
      </div>
    </main>
  );
}
