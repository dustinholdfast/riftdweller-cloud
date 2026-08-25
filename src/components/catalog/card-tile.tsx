import Link from "next/link";

import { CardBadge } from "@/components/catalog/card-badge";

type CatalogCard = {
  slug: string;
  name: string;
  faction: string;
  type: string;
  rarity: string;
  cost: number;
  attack: number | null;
  health: number | null;
  flavorText: string | null;
};

export function CardTile({ card }: { card: CatalogCard }) {
  return (
    <Link
      href={`/catalog/${card.slug}`}
      aria-label={`View ${card.name} details`}
      className="group flex min-h-80 flex-col rounded-2xl border border-[var(--rift-border)] bg-[var(--rift-surface)] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--rift-border-strong)] hover:bg-[var(--rift-surface-raised)] focus-visible:outline-none focus-visible:shadow-[var(--glow-arcane)]"
    >
      <div className="flex items-start justify-between gap-2 px-1 pb-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--rift-text-tertiary)]">
            {card.faction}
          </p>
          <h2 className="mt-1 font-display text-sm font-semibold leading-snug text-[var(--rift-text-primary)] sm:text-base">
            {card.name}
          </h2>
        </div>
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full border border-[var(--rift-border-strong)] bg-[var(--rift-surface-raised)] font-mono text-sm"
          aria-label={`${card.cost} cost`}
        >
          {card.cost}
        </span>
      </div>

      <div className="relative aspect-[5/4] overflow-hidden rounded-md border border-[var(--rift-border)] bg-[var(--rift-surface-raised)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(209,69,61,0.28),transparent_52%),radial-gradient(circle_at_78%_82%,rgba(139,92,246,0.24),transparent_55%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-x-5 bottom-4 h-px bg-gradient-to-r from-transparent via-[var(--rift-border-strong)] to-transparent" />
        <span className="absolute inset-0 grid place-items-center font-display text-3xl text-[var(--rift-text-tertiary)]/40" aria-hidden="true">
          {card.name.charAt(0)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <CardBadge rarity={card.rarity}>{card.rarity}</CardBadge>
        <CardBadge>{card.type}</CardBadge>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--rift-text-secondary)]">
        {card.flavorText || "A relic drawn from the RiftDweller archive."}
      </p>

      <div className="mt-auto flex items-end justify-between pt-4 text-xs text-[var(--rift-text-tertiary)]">
        <span>View card</span>
        {card.attack !== null && card.health !== null ? (
          <span
            className="font-mono text-sm font-medium text-[var(--rift-text-primary)]"
            aria-label={`${card.attack} attack, ${card.health} health`}
          >
            {card.attack}/{card.health}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
