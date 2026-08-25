const rarityStyles: Record<string, string> = {
  Common:
    "border-[var(--rarity-common-border)] bg-[var(--rarity-common-bg)] text-[var(--rarity-common-text)]",
  Uncommon:
    "border-[var(--rarity-uncommon-border)] bg-[var(--rarity-uncommon-bg)] text-[var(--rarity-uncommon-text)]",
  Rare: "border-[var(--rarity-rare-border)] bg-[var(--rarity-rare-bg)] text-[var(--rarity-rare-text)]",
  Epic: "border-[var(--rarity-epic-border)] bg-[var(--rarity-epic-bg)] text-[var(--rarity-epic-text)]",
  Legendary:
    "border-[var(--rarity-legendary-border)] bg-[var(--rarity-legendary-bg)] text-[var(--rarity-legendary-text)]",
};

export function CardBadge({
  children,
  rarity,
}: {
  children: React.ReactNode;
  rarity?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide ${
        rarity
          ? (rarityStyles[rarity] ?? rarityStyles.Common)
          : "border-[var(--rift-border)] bg-[var(--rift-surface-raised)] text-[var(--rift-text-secondary)]"
      }`}
    >
      {rarity ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  );
}
