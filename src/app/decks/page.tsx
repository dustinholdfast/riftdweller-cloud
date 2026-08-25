import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { listOwnedDecks } from "@/lib/decks";
import { createDeckAction } from "./actions";

export const metadata = { title: "My decks | RiftDweller Cloud" };

export default async function DecksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/decks");
  const decks = await listOwnedDecks(session);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-6 py-12">
      <header>
        <p className="text-sm uppercase tracking-widest text-zinc-400">Private collection</p>
        <h1 className="mt-2 text-3xl font-semibold">My decks</h1>
        <p className="mt-3 text-zinc-400">Only you can view and change these decks.</p>
      </header>

      <section aria-labelledby="create-deck-heading" className="rounded-lg border border-zinc-800 p-6">
        <h2 id="create-deck-heading" className="text-xl font-semibold">Create a deck</h2>
        <form action={createDeckAction} className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="grid gap-2">
            <span>Deck name</span>
            <input name="name" required maxLength={80} className="min-h-11 rounded border border-zinc-700 bg-zinc-950 px-3" />
          </label>
          <button type="submit" className="min-h-11 self-end rounded border border-zinc-600 px-5">Create deck</button>
        </form>
      </section>

      <section aria-labelledby="saved-decks-heading">
        <h2 id="saved-decks-heading" className="text-xl font-semibold">Saved decks</h2>
        {decks.length ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <li key={deck.id} className="rounded-lg border border-zinc-800 p-5">
                <Link href={`/decks/${deck.id}`} className="text-lg font-semibold underline-offset-4 hover:underline">{deck.name}</Link>
                <p className="mt-2 text-sm text-zinc-400">{deck._count.cards} unique card{deck._count.cards === 1 ? "" : "s"}</p>
                {deck.description && <p className="mt-3 line-clamp-2 text-sm">{deck.description}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-zinc-700 p-8 text-zinc-400">No decks yet. Name your first deck above.</p>
        )}
      </section>
    </main>
  );
}
