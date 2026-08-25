"use client";

export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid w-full max-w-3xl flex-1 place-items-center px-6 py-16">
      <section className="w-full rounded-lg border border-red-900 bg-red-950/30 p-8 text-center">
        <h1 className="text-2xl font-semibold">The archive is unreachable</h1>
        <p className="mt-2 text-zinc-300">
          The card catalog could not be loaded. Try opening it again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 min-h-11 rounded-md border border-red-700 px-5"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
