"use client";

export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid w-full max-w-3xl flex-1 place-items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-[color:var(--rift-danger)]/35 bg-[var(--rift-danger-bg)] p-8 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full border border-[color:var(--rift-danger)]/35 text-[var(--rift-danger)]" aria-hidden="true">!</span>
        <h1 className="mt-5 font-display text-2xl font-semibold">The archive is unreachable</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--rift-text-secondary)]">The card catalog could not be loaded. Try opening it again.</p>
        <button type="button" onClick={reset} className="mt-6 min-h-10 rounded-lg border border-[color:var(--rift-danger)]/45 px-5 text-sm font-semibold text-[var(--rift-danger)] hover:bg-[color:var(--rift-danger)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rift-danger)]">Try again</button>
      </section>
    </main>
  );
}
