export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em]">RiftDweller Cloud</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        Your decks await beyond the rift.
      </h1>
      <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
        Browse the card catalog, assemble private decks, and discover new card
        synergies.
      </p>
    </main>
  );
}
