import type { DeckSession } from "@/lib/decks";
import { getOwnedDeck } from "@/lib/decks";
import { prisma } from "@/lib/prisma";

const DEFAULT_RECOMMENDATION_LIMIT = 6;
const MAX_RECOMMENDATION_LIMIT = 20;

export type RecommendationCard = {
  id: string;
  slug: string;
  name: string;
  rulesText: string;
  flavorText: string | null;
  faction: string;
  type: string;
  rarity: string;
  cost: number;
  attack: number | null;
  health: number | null;
  setCode: string;
  collectorNumber: number;
  tags: string[];
};

export type RecommendationDeckCard = {
  quantity: number;
  card: RecommendationCard;
};

export type CardRecommendation = {
  card: RecommendationCard;
  score: number;
  reasons: string[];
  matchedTags: string[];
};

export type RecommendationOptions = {
  limit?: number;
};

type CurveBand = "low" | "mid" | "high";

const curveBand = (cost: number): CurveBand => {
  if (cost <= 2) return "low";
  if (cost <= 5) return "mid";
  return "high";
};

const curveLabels: Record<CurveBand, string> = {
  low: "early curve",
  mid: "mid curve",
  high: "late curve",
};

function increment(map: Map<string, number>, key: string, amount: number) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function normalizedLimit(limit: number | undefined) {
  if (limit === undefined) return DEFAULT_RECOMMENDATION_LIMIT;
  if (!Number.isFinite(limit)) return DEFAULT_RECOMMENDATION_LIMIT;
  return Math.min(MAX_RECOMMENDATION_LIMIT, Math.max(0, Math.floor(limit)));
}

function compareText(left: string, right: string) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/**
 * Scores catalog cards from explicit deck-composition rules. The final
 * collector-number/slug tie breakers make identical input deterministic even
 * when a database returns rows in a different order.
 */
export function recommendCards(
  deckCards: readonly RecommendationDeckCard[],
  catalog: readonly RecommendationCard[],
  options: RecommendationOptions = {},
): CardRecommendation[] {
  const limit = normalizedLimit(options.limit);
  if (limit === 0) return [];

  const ownedCardIds = new Set<string>();
  const tagCounts = new Map<string, number>();
  const factionCounts = new Map<string, number>();
  const typeCounts = new Map<string, number>();
  const curveCounts = new Map<CurveBand, number>([
    ["low", 0],
    ["mid", 0],
    ["high", 0],
  ]);
  let totalCards = 0;

  for (const entry of deckCards) {
    const quantity = Number.isInteger(entry.quantity)
      ? Math.max(0, entry.quantity)
      : 0;
    if (quantity === 0) continue;

    ownedCardIds.add(entry.card.id);
    totalCards += quantity;
    increment(factionCounts, entry.card.faction, quantity);
    increment(typeCounts, entry.card.type, quantity);
    increment(curveCounts, curveBand(entry.card.cost), quantity);
    for (const tag of new Set(entry.card.tags)) {
      increment(tagCounts, tag, quantity);
    }
  }

  const leastRepresentedCurve = totalCards
    ? (["low", "mid", "high"] as const).reduce((least, band) =>
        (curveCounts.get(band) ?? 0) < (curveCounts.get(least) ?? 0)
          ? band
          : least,
      )
    : null;

  return catalog
    .filter((card) => !ownedCardIds.has(card.id))
    .map((card): CardRecommendation => {
      const reasons: string[] = [];
      let score = 0;

      const matchedTags = [...new Set(card.tags)]
        .filter((tag) => tagCounts.has(tag))
        .sort((left, right) =>
          (tagCounts.get(right) ?? 0) - (tagCounts.get(left) ?? 0) ||
          compareText(left, right),
        );
      const tagAffinity = matchedTags.reduce(
        (sum, tag) => sum + (tagCounts.get(tag) ?? 0),
        0,
      );
      if (tagAffinity) {
        score += Math.min(30, tagAffinity * 5);
        reasons.push(`Synergizes with ${matchedTags[0]}.`);
      }

      const factionSupport = factionCounts.get(card.faction) ?? 0;
      if (factionSupport) {
        score += Math.min(18, factionSupport * 3);
        reasons.push(`Supports your ${card.faction} cards.`);
      }

      const band = curveBand(card.cost);
      if (leastRepresentedCurve === band) {
        score += 8;
        reasons.push(`Fills your ${curveLabels[band]}.`);
      }

      if (totalCards > 0 && !typeCounts.has(card.type)) {
        score += 5;
        reasons.push(`Adds a missing ${card.type.toLowerCase()} option.`);
      }

      if (reasons.length === 0) {
        reasons.push(
          totalCards === 0
            ? `A ${card.type.toLowerCase()} to start your deck at cost ${card.cost}.`
            : `Broadens your options with a cost ${card.cost} ${card.type.toLowerCase()}.`,
        );
      }

      return {
        card,
        score,
        reasons: reasons.slice(0, 2),
        matchedTags,
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.matchedTags.length - left.matchedTags.length ||
        left.card.cost - right.card.cost ||
        left.card.collectorNumber - right.card.collectorNumber ||
        compareText(left.card.slug, right.card.slug),
    )
    .slice(0, limit);
}

/** Returns null for a missing deck and enforces the same owner boundary as CRUD. */
export async function getDeckRecommendations(
  session: DeckSession,
  deckId: string,
  options: RecommendationOptions = {},
) {
  const deck = await getOwnedDeck(session, deckId);
  if (!deck) return null;

  const catalog = await prisma.card.findMany({
    include: { tags: { select: { tag: true } } },
  });
  const cardsById = new Map(catalog.map((card) => [card.id, card]));

  const recommendationCatalog = catalog.map((card) => ({
    ...card,
    tags: card.tags.map(({ tag }) => tag).sort(compareText),
  }));
  const recommendationDeck = deck.cards.flatMap(({ cardId, quantity }) => {
    const card = cardsById.get(cardId);
    if (!card) return [];
    return [
      {
        quantity,
        card: {
          ...card,
          tags: card.tags.map(({ tag }) => tag).sort(compareText),
        },
      },
    ];
  });

  return recommendCards(recommendationDeck, recommendationCatalog, options);
}
