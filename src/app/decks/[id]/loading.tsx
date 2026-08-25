export default function DeckEditorLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-28 pt-10 md:px-8 md:pt-14" aria-busy="true">
      <div className="h-5 w-24 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
      <div className="mt-4 mb-8 space-y-4">
        <div className="h-3 w-28 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
        <div className="h-12 w-64 animate-pulse rounded-lg bg-[var(--rift-surface-raised)]" />
        <div className="h-5 w-56 animate-pulse rounded bg-[var(--rift-surface-raised)]" />
      </div>
      <span className="sr-only">Loading deck</span>
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)]" />
          <div className="h-32 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)]" />
        </div>
        <div className="space-y-8">
          <div className="h-64 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[linear-gradient(100deg,var(--rift-surface)_30%,var(--rift-surface-raised)_50%,var(--rift-surface)_70%)] bg-[length:200%_100%]" />
          <div className="h-40 animate-pulse rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)]" />
        </div>
      </div>
    </main>
  );
}
