import Link from "next/link";

export default function DeckNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Deck not found</h1>
      <p className="mt-4 text-zinc-400">This deck does not exist or is not available to your account.</p>
      <Link href="/decks" className="mt-6 inline-block underline">Return to my decks</Link>
    </main>
  );
}
