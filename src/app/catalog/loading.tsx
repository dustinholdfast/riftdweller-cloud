export default function CatalogLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-8 md:py-14" aria-busy="true">
      <div className="mb-8 space-y-4">
        <div className="h-3 w-28 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
        <div className="h-12 w-64 animate-pulse rounded-lg bg-[var(--rift-surface-raised)]" />
        <div className="h-6 max-w-xl animate-pulse rounded bg-[var(--rift-surface-raised)]" />
      </div>
      <div className="mb-8 h-36 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] lg:h-24" />
      <span className="sr-only">Loading card catalog</span>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="min-h-80 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[linear-gradient(100deg,var(--rift-surface)_30%,var(--rift-surface-raised)_50%,var(--rift-surface)_70%)] bg-[length:200%_100%]" />
        ))}
      </div>
    </main>
  );
}
