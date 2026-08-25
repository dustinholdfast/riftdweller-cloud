import Link from "next/link";

import { CardTile } from "@/components/catalog/card-tile";
import {
  CARD_FACTIONS,
  CARD_RARITIES,
  CARD_TYPES,
} from "@/data/card-catalog";
import { buildCatalogWhere, parseCatalogFilters } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = parseCatalogFilters(await searchParams);
  const cards = await prisma.card.findMany({
    where: buildCatalogWhere(filters),
    orderBy: [{ collectorNumber: "asc" }],
  });
  const hasFilters = Boolean(
    filters.query || filters.faction || filters.type || filters.rarity,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-8 md:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rift-ember)]">
          The archive
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Card catalog
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--rift-text-secondary)]">
          Search the RiftDweller collection by name, rules, flavor, or synergy,
          then refine the archive by faction, type, and rarity.
        </p>
      </header>

      <form
        action="/catalog"
        className="sticky top-0 z-10 mb-7 grid gap-4 rounded-2xl border border-[var(--rift-border)] bg-[color:var(--rift-surface)]/95 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur md:grid-cols-2 lg:grid-cols-[minmax(16rem,2fr)_repeat(3,minmax(8rem,1fr))_auto]"
      >
        <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
          <span>Search cards</span>
          <span className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={filters.query}
              maxLength={100}
              placeholder="Name, rules, flavor, or tag"
              className="min-h-11 w-full rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] py-2 pl-10 pr-3 text-sm normal-case tracking-normal text-[var(--rift-text-primary)] outline-none placeholder:text-[var(--rift-text-tertiary)] hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
            />
          </span>
        </label>
        <CatalogSelect label="Faction" name="faction" value={filters.faction} options={CARD_FACTIONS} />
        <CatalogSelect label="Type" name="type" value={filters.type} options={CARD_TYPES} />
        <CatalogSelect label="Rarity" name="rarity" value={filters.rarity} options={CARD_RARITIES} />
        <button
          type="submit"
          className="min-h-11 self-end rounded-lg border border-transparent bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]"
        >
          Apply filters
        </button>
      </form>

      <div className="mb-4 flex min-h-10 items-center justify-between gap-4 border-b border-[var(--rift-border)] pb-4">
        <p aria-live="polite" className="text-sm text-[var(--rift-text-secondary)]">
          <span className="font-mono text-[var(--rift-text-primary)]">{cards.length}</span>{" "}
          {cards.length === 1 ? "card" : "cards"} found
        </p>
        {hasFilters ? (
          <Link
            href="/catalog"
            className="rounded-md px-2 py-2 text-sm font-semibold text-[var(--rift-text-primary)] underline decoration-[var(--rift-arcane)] underline-offset-4 focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      {cards.length ? (
        <section aria-label="Catalog results" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cards.map((card) => <CardTile key={card.id} card={card} />)}
        </section>
      ) : (
        <section className="flex flex-col items-center rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-[color:var(--rift-ember-solid)]/15 text-[var(--rift-ember)]" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold">No cards crossed the rift</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--rift-text-secondary)]">
            Nothing matches this search. Try a broader term or return to the full archive.
          </p>
          <Link href="/catalog" className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-[var(--rift-ember-solid)] px-5 text-sm font-semibold text-white hover:bg-[var(--rift-ember-hover)] focus-visible:outline-none focus-visible:shadow-[var(--glow-ember)]">
            Clear filters
          </Link>
        </section>
      )}
    </main>
  );
}

function CatalogSelect({ label, name, value, options }: { label: string; name: string; value?: string; options: readonly string[] }) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rift-text-tertiary)]">
      <span>{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="min-h-11 rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)] px-3 text-sm normal-case tracking-normal text-[var(--rift-text-primary)] outline-none hover:border-[var(--rift-border-strong)] focus:border-[var(--rift-arcane)] focus:shadow-[var(--glow-arcane)]"
      >
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
