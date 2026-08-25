import type { Prisma } from "@/generated/prisma/client";
import {
  CARD_FACTIONS,
  CARD_RARITIES,
  CARD_TYPES,
  type CardFaction,
  type CardRarity,
  type CardType,
} from "@/data/card-catalog";

export type CatalogFilters = {
  query: string;
  faction?: CardFaction;
  type?: CardType;
  rarity?: CardRarity;
};

type SearchParams = Record<string, string | string[] | undefined>;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const allowedValue = <T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined => allowed.find((option) => option === value);

export function parseCatalogFilters(params: SearchParams): CatalogFilters {
  return {
    query: firstValue(params.q)?.trim().slice(0, 100) ?? "",
    faction: allowedValue(firstValue(params.faction), CARD_FACTIONS),
    type: allowedValue(firstValue(params.type), CARD_TYPES),
    rarity: allowedValue(firstValue(params.rarity), CARD_RARITIES),
  };
}

export function buildCatalogWhere({
  query,
  faction,
  type,
  rarity,
}: CatalogFilters): Prisma.CardWhereInput {
  return {
    ...(faction ? { faction } : {}),
    ...(type ? { type } : {}),
    ...(rarity ? { rarity } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query } },
            { rulesText: { contains: query } },
            { flavorText: { contains: query } },
            { tags: { some: { tag: { contains: query } } } },
          ],
        }
      : {}),
  };
}
