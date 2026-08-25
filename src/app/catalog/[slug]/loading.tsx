export default function CardDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:px-8 md:py-14" aria-busy="true" aria-label="Loading card details">
      <div className="mb-7 h-5 w-48 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
      <div className="overflow-hidden rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] md:grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="min-h-80 animate-pulse bg-[linear-gradient(100deg,var(--rift-surface)_30%,var(--rift-surface-raised)_50%,var(--rift-surface)_70%)] bg-[length:200%_100%] md:min-h-[38rem]" />
        <div className="space-y-6 p-6 sm:p-8 md:p-10">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
          <div className="h-11 w-3/4 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
          <div className="h-8 w-44 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
          <div className="h-28 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
          <div className="h-40 animate-pulse rounded-xl bg-[var(--rift-surface-raised)]" />
        </div>
      </div>
    </main>
  );
}
