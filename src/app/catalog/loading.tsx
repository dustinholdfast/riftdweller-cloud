export default function CatalogLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10" aria-busy="true">
      <div className="mb-8 h-28 animate-pulse rounded-lg bg-zinc-900" />
      <div className="mb-8 h-24 animate-pulse rounded-lg bg-zinc-900" />
      <span className="sr-only">Loading card catalog</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-lg bg-zinc-900" />
        ))}
      </div>
    </main>
  );
}
