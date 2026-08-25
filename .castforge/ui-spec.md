# RiftDweller Cloud — UI Spec (Dark Fantasy Design Direction)

This is the contract the built view layer must satisfy. It covers every screen in the v1 milestone (Foundation, Accounts & Auth, Card Catalog, Deck Builder, Deck Recommendations). Designer restyle tasks for each phase should treat their relevant section here as the acceptance bar.

## 1. Direction

RiftDweller Cloud is a dark fantasy trading-card-game companion: browse a card catalog, build private decks, get rule-based recommendations. The UI should feel like a grimoire / relic vault at night — obsidian surfaces, parchment text, a low ember glow on primary actions, a violet arcane glow on secondary/magic-flavored actions (recommendations, synergy hints). It must stay legible and fast: no imagery dependencies, no heavy textures, CSS-only atmosphere (gradients, glows, hairline borders).

Avoid: cartoonish/high-saturation "gamer" UI, pure black-and-white admin-panel look, light mode. This app is dark-mode only — do not implement a light theme.

## 2. Design tokens

### 2.1 Color

Add these as CSS custom properties in `src/app/globals.css` (replacing the current placeholder `--background`/`--foreground` pair) and expose them via Tailwind v4 `@theme inline` the same way the scaffold already does for `--color-background` / `--color-foreground`.

```css
:root {
  /* surfaces */
  --rift-void: #0b0710;        /* page background */
  --rift-surface: #16101d;     /* panels, cards, inputs */
  --rift-surface-raised: #1f1729; /* modals, popovers, hover state */
  --rift-border: #2f2438;      /* default hairline border */
  --rift-border-strong: #4a3a58; /* hover/focus border */

  /* text */
  --rift-text-primary: #f2e9dc;   /* parchment — headings, body */
  --rift-text-secondary: #b3a6b8; /* muted lavender-gray — captions, labels */
  --rift-text-tertiary: #7c6f83;  /* placeholders, disabled */

  /* brand accents */
  --rift-ember: #d1453d;        /* accent color: borders, icons, badges, glow */
  --rift-ember-solid: #b23430;  /* solid fill for primary buttons (AA-safe w/ white text) */
  --rift-ember-hover: #c93f37;
  --rift-arcane: #8b5cf6;       /* accent color: links, focus rings, glow */
  --rift-arcane-solid: #7c3aed; /* solid fill for secondary/magic buttons (AA-safe w/ white text) */
  --rift-arcane-hover: #6d28d9;

  /* semantic */
  --rift-success: #4ade80;
  --rift-danger: #f87171;
  --rift-danger-bg: #2a1416;
  --rift-warning: #fbbf24;

  /* rarity scale (catalog + deck builder) */
  --rarity-common-text: #b6bec9;   --rarity-common-bg: rgba(156,163,175,0.12);   --rarity-common-border: rgba(156,163,175,0.35);
  --rarity-uncommon-text: #6ee7a0; --rarity-uncommon-bg: rgba(74,222,128,0.12);  --rarity-uncommon-border: rgba(74,222,128,0.35);
  --rarity-rare-text: #7dd3fc;     --rarity-rare-bg: rgba(56,189,248,0.12);      --rarity-rare-border: rgba(56,189,248,0.35);
  --rarity-epic-text: #c4b5fd;     --rarity-epic-bg: rgba(167,139,250,0.12);     --rarity-epic-border: rgba(167,139,250,0.35);
  --rarity-legendary-text: #fbbf24; --rarity-legendary-bg: rgba(245,158,11,0.14); --rarity-legendary-border: rgba(245,158,11,0.4);
}
```

Contrast notes (WCAG AA, verified against actual formula, not eyeballed):
- `--rift-text-primary` on `--rift-void` / `--rift-surface`: ~15:1 / ~13:1. Safe for all body text.
- `--rift-text-secondary` on `--rift-surface`: ~7:1. Safe for captions ≥ 14px.
- White text on `--rift-ember-solid`: ~6.1:1. White text on `--rift-arcane-solid`: ~5.7:1. Both pass AA for normal-size button labels.
- **Do not** put white or parchment text directly on `--rift-ember` or `--rift-arcane` (the lighter accent tones) — those are ~3.7–4.2:1 and only pass at large/bold text sizes. Use the `-solid` variants for any filled button or chip that carries small text.
- Rarity chip text colors are bright against near-black backgrounds (>10:1) regardless of which rarity — safe as-is.

### 2.2 Typography

- **Display** (`font-display`): `Cinzel` (Google Font, serif, small-caps-capable) — page hero titles, section headers (`h1`/`h2`), the logo wordmark, and card names on the card face. Evokes carved-stone / grimoire lettering without being a novelty font.
- **UI/body** (`font-sans`): keep the scaffold's `Geist Sans` — nav, buttons, form labels, body copy, descriptions. It's already wired via `next/font` in `layout.tsx`; the Coder adds the `Cinzel` variable alongside it the same way.
- **Numerics** (`font-mono`): keep `Geist Mono` for mana cost, power/toughness, deck counts — anything tabular where digits must align.

Type scale (Tailwind defaults, reuse rather than inventing new steps):
`text-xs` 12/16, `text-sm` 14/20, `text-base` 16/24, `text-lg` 18/28, `text-xl` 20/28, `text-2xl` 24/32, `text-3xl` 30/36, `text-4xl` 36/40, `text-5xl` 48/1, `text-6xl` 60/1.

Rules:
- Display font is for headings only, never body paragraphs or form fields (serif at small sizes hurts legibility).
- Letter-spacing: display headings get `tracking-tight`; eyebrow/label text (uppercase, `text-xs`/`text-sm`) gets `tracking-[0.2em]` — the scaffold's homepage already does this for the "RiftDweller Cloud" eyebrow, keep it as the pattern for all section eyebrows.

### 2.3 Spacing, radius, elevation

- Spacing: Tailwind's default 4px scale. Page gutter `px-6` mobile / `px-8` desktop; max content width `max-w-6xl` for catalog/deck grids, `max-w-5xl` for auth/prose.
- Radius: `--radius-sm: 6px` (inputs, badges, chips), `--radius-md: 10px` (buttons, small panels), `--radius-lg: 16px` (cards, modals, the main panel shells).
- Elevation (dark UI has no real drop shadows — use border + glow instead of gray shadows):
  - `--shadow-panel: 0 8px 30px rgba(0,0,0,0.45)` — modals, dropdowns, popovers only.
  - `--glow-ember: 0 0 0 1px rgba(209,69,61,0.4), 0 0 24px rgba(209,69,61,0.25)` — primary CTA hover/focus, selected/owned card state.
  - `--glow-arcane: 0 0 0 1px rgba(139,92,246,0.4), 0 0 24px rgba(139,92,246,0.25)` — recommendation panel, "suggested" card state, focus rings on inputs.
- Borders: 1px hairline `--rift-border` everywhere by default; `--rift-border-strong` on hover; never a fully opaque bright border except the glow states above.

## 3. Component inventory

Reusable primitives are built as standalone reference cards in `.castforge/design-system/components/`. Build screens by composing these, not by re-deriving styles ad hoc.

| Component | Purpose | States |
|---|---|---|
| `Button` | primary (ember), secondary (arcane), ghost, danger, disabled | default, hover, focus-visible, disabled, loading (spinner + disabled) |
| `CardTile` | one catalog/deck card face — name, type, rarity chip, mana/cost, art placeholder, flavor line | default, hover (lift + border-strong), selected/owned (ember glow ring), suggested (arcane glow ring), disabled (dimmed, in deck builder when at max copies) |
| `Badge` | rarity chip + card-type chip | one per rarity tier; neutral variant for type |
| `Input` | text/search field, used for search bar and all auth/form fields | default, focus (arcane ring), invalid (danger border + helper text), disabled |
| `EmptyState` | "nothing here yet" block for catalog search, empty deck, no recommendations | icon + heading + body + optional CTA button |
| `Navbar` | app shell header — wordmark, nav links (Catalog / Deck Builder), auth state (sign in vs. avatar/menu) | logged-out, logged-in, active-route underline |

Additional screen-specific composition (not separate reference cards, but built from the primitives above):
- **Auth pages** (login/signup): centered `max-w-sm` panel on `--rift-surface`, `Input` stack, primary `Button`, link to switch between login/signup in `--rift-arcane` text.
- **Catalog page**: `Navbar` + sticky filter bar (`Input` search + type/rarity `Badge`-style filter toggles) + responsive `CardTile` grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`, `gap-4`).
- **Card detail** (modal or slide-over): larger `CardTile` rendering, full rules text, "Add to deck" primary `Button`.
- **Deck builder**: two-pane layout — left: deck list/sidebar; right: current deck (card slots as compact `CardTile` rows with quantity stepper) + catalog picker below or in a tab; sticky deck-total/mana-curve footer.
- **Recommendations**: panel inset into the deck builder with `--glow-arcane` border treatment, each suggestion is a `CardTile` plus a one-line reason chip (e.g. "fills your low curve", "synergizes with Undead").

## 4. Empty, loading, and error states

Every list/data view (catalog grid, deck list, deck contents, recommendations) must implement all three:

- **Loading**: skeleton blocks shaped like the eventual content (skeleton `CardTile` = rounded-lg gray-pulse block at the card's aspect ratio, not a generic spinner-only page) except for full-page auth actions, which may use an inline `Button` spinner. Never show a blank white/void screen with no feedback.
- **Empty**: use `EmptyState` — a short heading in display font, one line of body copy explaining why it's empty and what to do next, and a CTA when there's an obvious next action (e.g. empty deck → "Browse the catalog" button; no search results → "Clear filters" button). Never show a bare "No results" with nothing else.
- **Error**: inline banner using `--rift-danger` / `--rift-danger-bg`, plain-language message (no raw error codes/stack traces), a retry action where the failure is retryable (failed fetch) vs. a corrective action where it isn't (form validation — point at the specific field).

## 5. Responsive behavior

- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- Navbar collapses to a hamburger/menu below `md`; nav links are never hidden entirely (must remain reachable via the menu).
- Catalog/deck grids reflow column count at each breakpoint per §3; never horizontal-scroll a grid.
- Deck builder's two-pane layout stacks vertically below `lg` (deck contents above, catalog picker below, both full width) rather than compressing panes to unreadable widths.
- Forms and modals are full-width with `px-4` gutters below `sm`, never fixed-width narrower than the viewport allows.
- Touch targets (buttons, card-add controls, nav items) are at least 40px in the shorter dimension on all breakpoints.

## 6. Copy tone

Short, in-world but not overwrought: "Your decks await beyond the rift" (existing homepage line) is the right register. Buttons use plain verbs ("Save deck", "Sign in", "Add to deck") — save the flavor language for headings and empty-state copy, not for functional UI labels a user needs to parse quickly.

## 7. Quality bar (what a review checks)

1. **Hierarchy/spacing** — display font reserved for headings; consistent vertical rhythm using the spacing scale in §2.3; no ad hoc pixel values.
2. **Alignment/consistency** — every button/input/badge instance pulls from the `Button`/`Input`/`Badge` primitives, not one-off styled elements.
3. **Color/contrast** — token usage matches §2.1's contrast notes; no light-mode leakage; rarity/status color is never the only signal (always paired with text).
4. **Responsive** — verified at `sm`, `md`, `lg`, `xl` per §5.
5. **Empty/loading/error** — present and matching §4 on every data-bearing view.
6. **Copy** — matches §6; no lorem ipsum or raw technical strings in user-facing copy.
