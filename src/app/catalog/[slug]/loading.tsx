export default function CardDetailLoading() {
  return (
    <main
      className="mx-auto w-full max-w-5xl flex-1 px-6 py-10"
      aria-busy="true"
      aria-label="Loading card details"
    >
      <div className="mb-8 h-5 w-48 animate-pulse rounded bg-zinc-900" />
      <div className="grid min-h-96 animate-pulse gap-8 rounded-lg border border-zinc-800 bg-zinc-950 p-6 md:grid-cols-[2fr_1fr] md:p-8">
        <div className="space-y-5">
          <div className="h-4 w-36 rounded bg-zinc-800" />
          <div className="h-12 w-2/3 rounded bg-zinc-800" />
          <div className="mt-12 h-24 rounded bg-zinc-800" />
        </div>
        <div className="rounded-lg bg-zinc-900" />
      </div>
    </main>
  );
}
