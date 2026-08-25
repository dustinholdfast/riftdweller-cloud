import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

type CardDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const getCard = cache((slug: string) =>
  prisma.card.findUnique({
    where: { slug },
    include: { tags: { orderBy: { tag: "asc" } } },
  }),
);

export async function generateMetadata({
  params,
}: CardDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCard(slug);

  if (!card) {
    return { title: "Card not found" };
  }

  return {
    title: `${card.name} | Card catalog`,
    description: card.rulesText,
  };
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { slug } = await params;
  const card = await getCard(slug);

  if (!card) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-400">
        <Link href="/catalog" className="underline underline-offset-4">
          Card catalog
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{card.name}</span>
      </nav>

      <article className="grid gap-8 rounded-lg border border-zinc-800 bg-zinc-950 p-6 md:grid-cols-[minmax(16rem,2fr)_minmax(15rem,1fr)] md:p-8">
        <div>
          <div className="flex items-start justify-between gap-4">
            <header>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                {card.faction}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                {card.name}
              </h1>
            </header>
            <span
              className="grid size-12 shrink-0 place-items-center rounded-full border border-zinc-700 font-mono text-xl"
              aria-label={`${card.cost} cost`}
            >
              {card.cost}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="rounded border border-zinc-700 px-3 py-1">
              {card.type}
            </span>
            <span className="rounded border border-zinc-700 px-3 py-1">
              {card.rarity}
            </span>
          </div>

          <section aria-labelledby="rules-heading" className="mt-8">
            <h2 id="rules-heading" className="text-xl font-semibold">
              Rules
            </h2>
            <p className="mt-3 whitespace-pre-line leading-7">{card.rulesText}</p>
          </section>

          {card.flavorText ? (
            <blockquote className="mt-8 border-l-2 border-zinc-700 pl-4 italic text-zinc-400">
              “{card.flavorText}”
            </blockquote>
          ) : null}
        </div>

        <aside className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5" aria-label="Card data">
          {card.attack !== null && card.health !== null ? (
            <dl className="mb-6 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md border border-zinc-700 p-3">
                <dt className="text-xs uppercase tracking-wider text-zinc-400">Attack</dt>
                <dd className="mt-1 font-mono text-2xl">{card.attack}</dd>
              </div>
              <div className="rounded-md border border-zinc-700 p-3">
                <dt className="text-xs uppercase tracking-wider text-zinc-400">Health</dt>
                <dd className="mt-1 font-mono text-2xl">{card.health}</dd>
              </div>
            </dl>
          ) : null}

          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-zinc-400">Set</dt>
              <dd className="mt-1 font-mono">
                {card.setCode} / {card.collectorNumber.toString().padStart(3, "0")}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Synergy tags</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {card.tags.map(({ tag }) => (
                  <span key={tag} className="rounded border border-zinc-700 px-2 py-1 text-xs">
                    #{tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </article>
    </main>
  );
}
