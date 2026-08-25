import { describe, expect, it } from "vitest";

import {
  recommendCards,
  type RecommendationCard,
  type RecommendationDeckCard,
} from "@/lib/recommendations";

function card(
  id: string,
  overrides: Partial<RecommendationCard> = {},
): RecommendationCard {
  return {
    id,
    slug: id,
    name: id,
    rulesText: `${id} rules`,
    flavorText: null,
    faction: "Ember",
    type: "Unit",
    rarity: "Common",
    cost: 3,
    attack: 2,
    health: 2,
    setCode: "TST",
    collectorNumber: 1,
    tags: [],
    ...overrides,
  };
}

const emberScout = card("ember-scout", {
  cost: 1,
  collectorNumber: 10,
  tags: ["warrior", "burn", "burn"],
});
const emberStudy = card("ember-study", {
  type: "Spell",
  cost: 4,
  collectorNumber: 11,
  tags: ["draw", "burn"],
});
const deck: RecommendationDeckCard[] = [
  { quantity: 2, card: emberScout },
  { quantity: 1, card: emberStudy },
];

describe("recommendCards determinism", () => {
  it("returns identical recommendations for permuted deck and catalog order", () => {
    const candidates = [
      card("ember-relic", {
        type: "Relic",
        cost: 6,
        collectorNumber: 20,
        tags: ["warrior", "burn"],
      }),
      card("ember-finisher", {
        cost: 7,
        collectorNumber: 21,
        tags: ["burn"],
      }),
      card("void-relic", {
        faction: "Void",
        type: "Relic",
        cost: 6,
        collectorNumber: 22,
        tags: ["void"],
      }),
      emberScout,
      emberStudy,
    ];

    const expected = recommendCards(deck, candidates);
    const permutedDeck = [...deck]
      .reverse()
      .map((entry) => ({
        ...entry,
        card: { ...entry.card, tags: [...entry.card.tags].reverse() },
      }));
    const permutedCatalog = [...candidates].reverse();

    expect(recommendCards(permutedDeck, permutedCatalog)).toEqual(expected);
    expect(recommendCards(deck, candidates)).toEqual(expected);
  });

  it("uses stable cost, collector number, and slug tie-breakers", () => {
    const tiedCandidates = [
      card("zeta", { cost: 2, collectorNumber: 1 }),
      card("gamma", { cost: 1, collectorNumber: 2 }),
      card("beta", { cost: 1, collectorNumber: 1 }),
      card("alpha", { cost: 1, collectorNumber: 1 }),
    ];

    const rankedIds = recommendCards([], tiedCandidates).map(
      ({ card: recommendation }) => recommendation.id,
    );
    const reversedIds = recommendCards([], [...tiedCandidates].reverse()).map(
      ({ card: recommendation }) => recommendation.id,
    );

    expect(rankedIds).toEqual(["alpha", "beta", "gamma", "zeta"]);
    expect(reversedIds).toEqual(rankedIds);
  });

  it("calculates quantity-weighted scores and excludes cards already in the deck", () => {
    const candidates = [
      emberScout,
      emberStudy,
      card("ember-relic", {
        type: "Relic",
        cost: 6,
        collectorNumber: 20,
        tags: ["burn"],
      }),
      card("ember-warrior", {
        cost: 6,
        collectorNumber: 21,
        tags: ["warrior"],
      }),
      card("void-relic", {
        faction: "Void",
        type: "Relic",
        cost: 6,
        collectorNumber: 22,
      }),
    ];

    const recommendations = recommendCards(deck, candidates);

    expect(
      recommendations.map(({ card: recommendation, score }) => ({
        id: recommendation.id,
        score,
      })),
    ).toEqual([
      { id: "ember-relic", score: 37 },
      { id: "ember-warrior", score: 27 },
      { id: "void-relic", score: 13 },
    ]);
    expect(recommendations[0]).toMatchObject({
      matchedTags: ["burn"],
      reasons: ["Synergizes with burn.", "Supports your Ember cards."],
    });
  });

  it("normalizes limits without changing the stable ranking", () => {
    const candidates = [
      card("third", { collectorNumber: 3 }),
      card("first", { collectorNumber: 1 }),
      card("second", { collectorNumber: 2 }),
    ];

    expect(
      recommendCards([], candidates, { limit: 2.9 }).map(
        ({ card: recommendation }) => recommendation.id,
      ),
    ).toEqual(["first", "second"]);
    expect(recommendCards([], candidates, { limit: -1 })).toEqual([]);
    expect(
      recommendCards([], candidates, { limit: Number.NaN }).map(
        ({ card: recommendation }) => recommendation.id,
      ),
    ).toEqual(["first", "second", "third"]);
  });
});
