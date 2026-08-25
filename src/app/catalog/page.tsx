import Link from "next/link";

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
    include: { tags: { orderBy: { tag: "asc" } } },
    orderBy: [{ collectorNumber: "asc" }],
  });
  const hasFilters = Boolean(
    filters.query || filters.faction || filters.type || filters.rarity,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <header className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.2em]">The archive</p>
        <h1 className="text-4xl font-semibold tracking-tight">Card catalog</h1>
        <p className="max-w-2xl text-zinc-400">
          Search the RiftDweller collection by name, rules text, flavor, or
          synergy tag, then narrow it by faction, type, and rarity.
        </p>
      </header>

      <form
        action="/catalog"
        className="mb-8 grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-2 lg:grid-cols-[minmax(16rem,2fr)_repeat(3,minmax(9rem,1fr))_auto]"
      >
        <label className="grid gap-1 text-sm">
          <span>Search cards</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.query}
            maxLength={100}
            placeholder="Name, rules, flavor, or tag"
            className="min-h-11 rounded-md border border-zinc-700 bg-zinc-900 px-3"
          />
        </label>
        <CatalogSelect
          label="Faction"
          name="faction"
          value={filters.faction}
          options={CARD_FACTIONS}
        />
        <CatalogSelect
          label="Type"
          name="type"
          value={filters.type}
          options={CARD_TYPES}
        />
        <CatalogSelect
          label="Rarity"
          name="rarity"
          value={filters.rarity}
          options={CARD_RARITIES}
        />
        <button
          type="submit"
          className="min-h-11 self-end rounded-md border border-zinc-600 px-5 font-medium"
        >
          Apply
        </button>
      </form>

      <div className="mb-4 flex min-h-10 items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-zinc-400">
          {cards.length} {cards.length === 1 ? "card" : "cards"} found
        </p>
        {hasFilters ? (
          <Link href="/catalog" className="text-sm underline underline-offset-4">
            Clear filters
          </Link>
        ) : null}
      </div>

      {cards.length ? (
        <section
          aria-label="Catalog results"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex min-h-80 flex-col rounded-lg border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    {card.faction}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{card.name}</h2>
                </div>
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-700 font-mono text-lg"
                  aria-label={`${card.cost} cost`}
                >
                  {card.cost}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded border border-zinc-700 px-2 py-1">
                  {card.type}
                </span>
                <span className="rounded border border-zinc-700 px-2 py-1">
                  {card.rarity}
                </span>
              </div>

              <p className="text-sm leading-6">{card.rulesText}</p>
              {card.flavorText ? (
                <p className="mt-3 text-sm italic text-zinc-400">
                  &quot;{card.flavorText}&quot;
                </p>
              ) : null}

              <div className="mt-auto pt-5">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {card.tags.map(({ tag }) => (
                    <span key={tag} className="text-xs text-zinc-500">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between border-t border-zinc-800 pt-3 text-xs text-zinc-500">
                  <span>
                    {card.setCode} / {card.collectorNumber.toString().padStart(3, "0")}
                  </span>
                  {card.attack !== null && card.health !== null ? (
                    <span
                      className="font-mono text-base text-zinc-200"
                      aria-label={`${card.attack} attack, ${card.health} health`}
                    >
                      {card.attack} / {card.health}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-zinc-700 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">No cards crossed the rift</h2>
          <p className="mx-auto mt-2 max-w-md text-zinc-400">
            Try a broader search or clear the filters to return to the full
            archive.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex min-h-11 items-center rounded-md border border-zinc-600 px-5"
          >
            Clear filters
          </Link>
        </section>
      )}
    </main>
  );
}

function CatalogSelect({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  options: readonly string[];
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span>{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="min-h-11 rounded-md border border-zinc-700 bg-zinc-900 px-3"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
