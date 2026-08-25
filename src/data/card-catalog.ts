export const CARD_FACTIONS = [
  "Ashen Covenant",
  "Verdant Hollow",
  "Umbral Court",
  "Tidebound",
  "Ironclad",
  "Riftborn",
] as const;

export const CARD_TYPES = ["Unit", "Spell", "Relic"] as const;
export const CARD_RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
] as const;

export type CardFaction = (typeof CARD_FACTIONS)[number];
export type CardType = (typeof CARD_TYPES)[number];
export type CardRarity = (typeof CARD_RARITIES)[number];

export type SeedCard = {
  slug: string;
  name: string;
  rulesText: string;
  flavorText: string;
  faction: CardFaction;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  attack: number | null;
  health: number | null;
  setCode: "RIFT";
  collectorNumber: number;
  tags: string[];
};

type CardBlueprint = Omit<SeedCard, "slug" | "setCode" | "collectorNumber">;

const unit = (
  name: string,
  faction: CardFaction,
  rarity: CardRarity,
  cost: number,
  attack: number,
  health: number,
  rulesText: string,
  flavorText: string,
  tags: string[],
): CardBlueprint => ({
  name, faction, rarity, cost, attack, health, rulesText, flavorText, tags, type: "Unit",
});

const nonUnit = (
  type: "Spell" | "Relic",
  name: string,
  faction: CardFaction,
  rarity: CardRarity,
  cost: number,
  rulesText: string,
  flavorText: string,
  tags: string[],
): CardBlueprint => ({
  name, faction, rarity, cost, rulesText, flavorText, tags, type, attack: null, health: null,
});

const blueprints: CardBlueprint[] = [
  unit("Cinder Initiate", "Ashen Covenant", "Common", 1, 2, 1, "When this is defeated, deal 1 damage to the opposing champion.", "Every oath begins with a spark.", ["burn", "sacrifice", "aggressive"]),
  unit("Emberfang Hound", "Ashen Covenant", "Common", 2, 3, 2, "Rush — This can attack units on the turn it enters play.", "It hunts by the scent of cooling steel.", ["burn", "beast", "aggressive"]),
  unit("Pyre Acolyte", "Ashen Covenant", "Uncommon", 3, 2, 4, "Whenever you sacrifice another unit, gain 1 ember this turn.", "The flame takes; the faithful collect.", ["sacrifice", "ramp", "cultist"]),
  unit("Ashwake Marauder", "Ashen Covenant", "Rare", 4, 5, 3, "Gets +1 attack for each friendly unit defeated this turn.", "Behind her, even footprints smolder.", ["sacrifice", "aggressive", "warrior"]),
  unit("Varkesh, the Last Coal", "Ashen Covenant", "Legendary", 7, 7, 6, "When this enters play, return each friendly unit defeated this turn with 1 health.", "A dying fire remembers every name fed to it.", ["sacrifice", "revive", "finisher"]),
  nonUnit("Spell", "Kindle the Fallen", "Ashen Covenant", "Common", 2, "Sacrifice a friendly unit. Deal damage equal to its attack to any target.", "What is grief but fuel?", ["sacrifice", "burn", "removal"]),
  nonUnit("Spell", "Rain of Cinders", "Ashen Covenant", "Epic", 5, "Deal 2 damage to every unit. Deal 1 more to damaged units.", "The sky burned long after the siege was forgotten.", ["burn", "sweeper", "control"]),
  nonUnit("Relic", "Furnace-Heart Idol", "Ashen Covenant", "Rare", 3, "The first time you sacrifice a unit each turn, deal 1 damage to the opposing champion.", "Its pulse can be heard beneath the chanting.", ["sacrifice", "burn", "relic"]),

  unit("Mossback Forager", "Verdant Hollow", "Common", 1, 1, 3, "When this enters play, restore 1 health to your champion.", "Small hands tend the oldest roots.", ["heal", "beast", "growth"]),
  unit("Briarhorn Stag", "Verdant Hollow", "Common", 3, 3, 4, "When this is healed, give it +1 attack this turn.", "Its antlers bloom where blood once fell.", ["heal", "beast", "midrange"]),
  unit("Sporecap Tender", "Verdant Hollow", "Uncommon", 2, 1, 4, "At the end of your turn, if you restored health, summon a 1/1 Sporeling.", "Nothing in the Hollow grows alone.", ["heal", "swarm", "growth"]),
  unit("Rootbound Guardian", "Verdant Hollow", "Rare", 5, 4, 7, "Guard. Other friendly Beasts have +1 health.", "Axes dull. Roots endure.", ["guard", "beast", "support"]),
  unit("Elder Oruun", "Verdant Hollow", "Legendary", 8, 6, 10, "When this enters play, double the health restored by your effects this turn.", "Forests are merely his thoughts made visible.", ["heal", "ancient", "finisher"]),
  nonUnit("Spell", "Wild Reclamation", "Verdant Hollow", "Common", 2, "Restore 3 health to a unit. If it is a Beast, draw a card.", "The wild remembers its own.", ["heal", "beast", "draw"]),
  nonUnit("Spell", "Overgrowth", "Verdant Hollow", "Epic", 6, "Give your units +2/+2. Summon a 1/1 Sporeling for each empty unit slot.", "By dawn, the road had vanished.", ["growth", "swarm", "finisher"]),
  nonUnit("Relic", "Seed of the First Grove", "Verdant Hollow", "Rare", 3, "The first unit you play each turn with cost 4 or more costs 1 less.", "All forests dream of returning home.", ["ramp", "growth", "relic"]),

  unit("Graveyard Moth", "Umbral Court", "Common", 1, 1, 2, "When this is discarded, draw a card, then lose 1 health.", "It feeds on names carved too shallow.", ["discard", "undead", "draw"]),
  unit("Crypt Bailiff", "Umbral Court", "Common", 2, 2, 3, "Drain 1 from the opposing champion when another Undead enters play.", "Death does not annul a debt.", ["drain", "undead", "swarm"]),
  unit("Veilborn Duelist", "Umbral Court", "Uncommon", 3, 4, 2, "When this defeats a unit, return a random discarded card to your hand.", "She has never lost to the living twice.", ["discard", "undead", "value"]),
  unit("Marrow Archivist", "Umbral Court", "Rare", 4, 2, 6, "The first card you discard each turn costs 1 less when recovered.", "Every bone is a volume; every grave, a library.", ["discard", "recursion", "support"]),
  unit("Queen Nerezza Unbound", "Umbral Court", "Legendary", 8, 6, 8, "When this enters play, summon up to three different Undead units discarded this game.", "Her coronation bell tolls beneath the earth.", ["undead", "recursion", "finisher"]),
  nonUnit("Spell", "Debt Beyond Death", "Umbral Court", "Common", 2, "Discard a card. Drain 2 health from any target.", "The Court always collects interest.", ["discard", "drain", "removal"]),
  nonUnit("Spell", "Open the Ossuary", "Umbral Court", "Epic", 6, "Return two units from your discard pile to play. They become Undead.", "The locks were meant to keep mourners out.", ["undead", "recursion", "tempo"]),
  nonUnit("Relic", "Chalice of Last Breath", "Umbral Court", "Rare", 3, "Once each turn when a unit is defeated, restore 1 health to your champion.", "It is never empty for long.", ["drain", "sacrifice", "relic"]),

  unit("Foamglass Adept", "Tidebound", "Common", 1, 1, 3, "The next Spell you play this turn costs 1 less.", "She reads tomorrow in each breaking wave.", ["spellcraft", "ramp", "mage"]),
  unit("Reefline Sentinel", "Tidebound", "Common", 2, 2, 4, "Guard while you have three or more cards in hand.", "No ship passes the blue line uncounted.", ["guard", "control", "soldier"]),
  unit("Mistcoil Serpent", "Tidebound", "Uncommon", 3, 3, 3, "When you draw your second card in a turn, return an enemy unit with cost 2 or less to hand.", "It surfaces only in reflections.", ["draw", "control", "beast"]),
  unit("Stormcall Savant", "Tidebound", "Rare", 5, 4, 5, "Whenever you play a Spell, deal 1 damage to a random enemy unit.", "Thunder is simply an argument made final.", ["spellcraft", "burn", "mage"]),
  unit("Ilyra of the Deep Hour", "Tidebound", "Legendary", 8, 5, 9, "The first Spell you play each turn is copied with new targets.", "At midnight, all tides answer her.", ["spellcraft", "control", "finisher"]),
  nonUnit("Spell", "Undertow", "Tidebound", "Common", 2, "Return a unit with cost 3 or less to its owner's hand.", "The sea gives no receipt.", ["control", "tempo", "removal"]),
  nonUnit("Spell", "Chart the Unseen", "Tidebound", "Epic", 4, "Draw three cards, then place a card from your hand on the bottom of your deck.", "Every blank edge hides another ocean.", ["draw", "spellcraft", "control"]),
  nonUnit("Relic", "Tempest Orrery", "Tidebound", "Rare", 3, "After you play your second Spell each turn, ready 1 resource.", "Its moons orbit storms that have not happened yet.", ["spellcraft", "ramp", "relic"]),

  unit("Rivet Squire", "Ironclad", "Common", 1, 1, 3, "When you play a Relic, give this +1 attack this turn.", "A loose plate is a lesson waiting to ring.", ["relic", "soldier", "tempo"]),
  unit("Bastion Smith", "Ironclad", "Common", 2, 2, 4, "The first Relic you play each turn costs 1 less.", "She can hear a fortress inside every ingot.", ["relic", "ramp", "artisan"]),
  unit("Gilded Bulwark", "Ironclad", "Uncommon", 4, 3, 7, "Guard. When equipped by a Relic, this cannot be damaged by Spells.", "Gold is soft. The oath beneath it is not.", ["guard", "relic", "soldier"]),
  unit("Siege-Crown Captain", "Ironclad", "Rare", 5, 5, 6, "Other units with Guard have +1 attack.", "A wall becomes an army when it learns to march.", ["guard", "soldier", "support"]),
  unit("The Walking Citadel", "Ironclad", "Legendary", 9, 8, 12, "Guard. Your Relics cannot be destroyed while this is in play.", "Cities once sheltered behind it. Now it seeks one worth saving.", ["guard", "relic", "finisher"]),
  nonUnit("Spell", "Hold the Gate", "Ironclad", "Common", 2, "Give a unit +0/+3 and Guard this turn. Draw a card if it already had Guard.", "One hinge. One shield. One more dawn.", ["guard", "draw", "combat"]),
  nonUnit("Relic", "Oathforged Plate", "Ironclad", "Rare", 3, "Equipped unit has +1/+2 and Guard.", "Hammered from promises no king could keep.", ["guard", "relic", "equipment"]),
  nonUnit("Relic", "Sunken War Engine", "Ironclad", "Epic", 6, "At the start of your turn, deal 2 damage to the highest-cost enemy unit.", "The lake receded. The war resumed.", ["relic", "control", "removal"]),

  unit("Rift Scavenger", "Riftborn", "Common", 1, 2, 2, "When this enters play, reveal the top card of your deck. If its faction differs from this, gain 1 health.", "Every world leaves something useful at the seam.", ["multifaction", "scout", "heal"]),
  unit("Lantern Wisp", "Riftborn", "Common", 2, 1, 3, "When this leaves play, look at the top two cards of your deck and reorder them.", "Follow it anywhere except home.", ["tempo", "spirit", "control"]),
  unit("Paradox Pilgrim", "Riftborn", "Uncommon", 3, 3, 3, "The first card you play each turn with a new type costs 1 less.", "Her path crosses itself, but never repeats.", ["multifaction", "ramp", "value"]),
  unit("Gatecrash Colossus", "Riftborn", "Rare", 6, 7, 6, "Costs 1 less for each faction among cards you played this turn.", "It wears ruined doorways as armor.", ["multifaction", "giant", "finisher"]),
  unit("Aevum, Between Worlds", "Riftborn", "Legendary", 8, 7, 7, "When this enters play, choose a friendly triggered ability and activate it twice.", "For one breath, every possible world agrees.", ["multifaction", "combo", "finisher"]),
  nonUnit("Spell", "Fracture Reality", "Riftborn", "Common", 2, "Choose a unit. It loses all abilities until your next turn.", "Certainty is the first thing through the crack.", ["control", "silence", "tempo"]),
  nonUnit("Spell", "Borrowed Tomorrow", "Riftborn", "Epic", 5, "Take an extra action after this one. Your next card costs 2 more.", "Time lends freely and collects without mercy.", ["combo", "tempo", "spellcraft"]),
  nonUnit("Relic", "Compass of Shattered Stars", "Riftborn", "Rare", 3, "Once each turn after you play a new card type, look at the top card of your deck; you may place it on the bottom.", "Its needle points to the world you need, not the one you want.", ["multifaction", "control", "relic"]),
];

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const CARD_CATALOG: SeedCard[] = blueprints.map((card, index) => ({
  ...card,
  slug: slugify(card.name),
  setCode: "RIFT",
  collectorNumber: index + 1,
  tags: [...new Set(card.tags)].sort(),
}));

if (new Set(CARD_CATALOG.map(({ slug }) => slug)).size !== CARD_CATALOG.length) {
  throw new Error("Card catalog contains duplicate slugs.");
}
