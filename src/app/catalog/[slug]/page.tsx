import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CardBadge } from "@/components/catalog/card-badge";
import { prisma } from "@/lib/prisma";

type CardDetailPageProps = { params: Promise<{ slug: string }> };

const getCard = cache((slug: string) =>
  prisma.card.findUnique({
    where: { slug },
    include: { tags: { orderBy: { tag: "asc" } } },
  }),
);

export async function generateMetadata({ params }: CardDetailPageProps): Promise<Metadata> {
  const card = await getCard((await params).slug);
  return card
    ? { title: `${card.name} | Card catalog`, description: card.rulesText }
    : { title: "Card not found" };
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const card = await getCard((await params).slug);
  if (!card) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:px-8 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-[var(--rift-text-secondary)]">
        <Link href="/catalog" className="rounded-sm py-1 text-[var(--rift-text-primary)] underline decoration-[var(--rift-arcane)] underline-offset-4 focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]">
          Card catalog
        </Link>
        <span aria-hidden="true" className="text-[var(--rift-text-tertiary)]">/</span>
        <span aria-current="page" className="truncate">{card.name}</span>
      </nav>

      <article className="overflow-hidden rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:grid md:grid-cols-[minmax(17rem,0.9fr)_minmax(20rem,1.1fr)]">
        <div className="relative min-h-80 overflow-hidden border-b border-[var(--rift-border)] bg-[var(--rift-surface-raised)] md:min-h-[38rem] md:border-b-0 md:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(209,69,61,0.3),transparent_48%),radial-gradient(circle_at_72%_78%,rgba(139,92,246,0.28),transparent_52%)]" />
          <div className="absolute inset-8 rounded-[inherit] border border-[var(--rift-border-strong)] opacity-70" />
          <span className="absolute inset-0 grid place-items-center font-display text-8xl font-semibold text-[var(--rift-text-tertiary)]/25" aria-hidden="true">
            {card.name.charAt(0)}
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--rift-surface)] via-[color:var(--rift-surface)]/85 to-transparent p-8 pt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-text-secondary)]">{card.faction}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{card.name}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <header className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-ember)]">Archive entry</p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{card.name}</h1>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-[var(--rift-border-strong)] bg-[var(--rift-surface-raised)] font-mono text-xl" aria-label={`${card.cost} cost`}>
              {card.cost}
            </span>
          </header>

          <div className="mt-5 flex flex-wrap gap-2">
            <CardBadge>{card.type}</CardBadge>
            <CardBadge rarity={card.rarity}>{card.rarity}</CardBadge>
          </div>

          <section aria-labelledby="rules-heading" className="mt-8 border-t border-[var(--rift-border)] pt-7">
            <h2 id="rules-heading" className="font-display text-lg font-semibold">Rules</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--rift-text-primary)]">{card.rulesText}</p>
          </section>

          {card.flavorText ? (
            <blockquote className="mt-7 border-l-2 border-[var(--rift-ember)] pl-4 text-sm italic leading-6 text-[var(--rift-text-secondary)]">
              &ldquo;{card.flavorText}&rdquo;
            </blockquote>
          ) : null}

          <aside className="mt-8 rounded-xl border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] p-5" aria-label="Card data">
            {card.attack !== null && card.health !== null ? (
              <dl className="mb-6 grid grid-cols-2 gap-3 text-center">
                <Stat label="Attack" value={card.attack} />
                <Stat label="Health" value={card.health} />
              </dl>
            ) : null}
            <dl className="grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">Set</dt>
                <dd className="mt-2 font-mono text-[var(--rift-text-primary)]">{card.setCode} / {card.collectorNumber.toString().padStart(3, "0")}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">Synergy tags</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {card.tags.map(({ tag }) => <CardBadge key={tag}>#{tag}</CardBadge>)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </article>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--rift-border)] bg-[var(--rift-surface)] p-3">
      <dt className="text-xs uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">{label}</dt>
      <dd className="mt-1 font-mono text-2xl">{value}</dd>
    </div>
  );
}
