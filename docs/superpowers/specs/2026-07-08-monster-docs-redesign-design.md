# Monster Documentation Redesign — Design

## Purpose

The generated bestiary page (`docs/monsters.html`, produced by `generator/lib/src/services/doc/documentation.service.ts` from `generator/lib/templates/index.html` + `monster.html`) has two problems:

1. **Navigation**: the sidebar menu only lists monster *families*, and each family link points at the first creature in that family. There's no way to jump directly to a specific creature (e.g. "Polar Bear") without scrolling through the whole family.
2. **Look & feel**: the page uses a dated, cramped, non-responsive parchment theme (`docs/atweaks.css`, shared with the rest of the Jekyll docs site) — dense bordered tables with `white-space: nowrap` that don't reflow on narrow screens.

This redesign fixes navigation and visual presentation without changing what information is shown per creature.

## Scope

In scope:
- Nested family → creature navigation menu (collapsible per family).
- New independent visual theme for this page only (light/dark, responsive).
- Restructured creature stat block (card/grid instead of a fixed table) for better mobile reflow.

Out of scope:
- Any change to the shared `docs/atweaks.css` or other static docs pages (`index.html`, `atweaks_instructions.html`, etc.) — those keep their current look.
- Any change to *what* data is shown per creature (ability scores, AC, movement, THAC0, APR, attacks, traits, size, morale, XP, abilities) — presentation only.
- Search/filter functionality — not requested.
- Introducing a real template engine — the existing `{{token}}` string-replacement approach in `documentation.service.ts` stays; only the markup it assembles changes.

## Design

### 1. Templating approach

No change to the templating *mechanism*. `documentation.service.ts` still does `{{token}}` replacement with a strict "throw if token missing" check. Only the HTML structure being assembled changes.

### 2. Navigation — nested accordion menu

Today, `addFamily(family)` pushes one flat `<li>` per family, linking to `family.creatures[0]`. Instead, `addFamily(family)` will build one full accordion block per family, using `family.creatures` (already available — each `Creature` has `.id` and translatable `.name`) to list every creature:

```html
<li class="family">
  <details>
    <summary>Bear</summary>
    <ul>
      <li><a href="#m4">Black Bear</a></li>
      <li><a href="#m5">Brown Bear</a></li>
      <li><a href="#m6">Cave Bear</a></li>
      <li><a href="#m7">Polar Bear</a></li>
    </ul>
  </details>
</li>
```

`<details>/<summary>` is used instead of a JS-driven accordion so the menu is fully functional (expand/collapse, keyboard-accessible) with zero JavaScript. This is a plain HTML/CSS mechanism, not a template engine change.

A small vanilla JS file (`docs/monsters.js`, hand-authored and not part of the generation pipeline — same as the CSS) adds two progressive enhancements on top:
- **Scrollspy**: as the reader scrolls the creature list, the corresponding family `<details>` auto-expands and the active creature link is highlighted in the menu.
- **Mobile drawer toggle**: below the responsive breakpoint, the sidebar becomes a hidden drawer opened via a toggle button in a top bar; JS opens/closes it and closes it again on link click.

Both are enhancements only — without JS (or if it fails to load), the menu still fully works via native `<details>` expand/collapse and normal anchor links.

### 3. Visual design

- **Theme**: system font stack, single fixed light theme (no `prefers-color-scheme` dark variant — see Revision below), single accent color for links/active states, generous whitespace replacing the current dense border-heavy look.
- **Layout**: CSS grid — sticky sidebar + fluid content column on desktop (≥768px); collapses to the drawer-behind-toggle-button pattern described above on narrower viewports.
- **Creature card**: the current `<table class="statBlock">` (forces `white-space: nowrap`, doesn't reflow) is replaced by a responsive CSS-grid label/value stat block inside a bordered card, showing the same fields in the same order. Column count reduces at narrow widths instead of causing horizontal scroll.
- **Traits glossary**: keeps its current content and structure, restyled to match the new theme.

This page's presentation becomes independent of `docs/atweaks.css`: new files `docs/monsters.css` and `docs/monsters.js` are introduced (hand-authored static assets, not generated), and the templates reference them instead of `atweaks.css`.

**Revision (post-implementation, during manual verification):** the initial implementation included light/dark theme support via `prefers-color-scheme`. After seeing the page rendered, the requester asked to keep the parchment background image (`docs/bkg_base.jpg`, the same texture used by the legacy `atweaks.css`) always visible behind the new layout, rather than a plain white/dark background. Since that parchment texture only reads well against a light theme, dark-mode support was dropped entirely in favor of always showing the parchment background — `docs/monsters.css`'s `body` rule sets `background-color: #f2ecda; background-image: url(./bkg_base.jpg);` unconditionally, and the `@media (prefers-color-scheme: dark)` block was removed.

### 4. Files touched

**Changed:**
- `generator/lib/src/services/doc/documentation.service.ts` — `addFamily` builds the nested accordion markup (grouped by family, listing every creature) instead of one flat family `<li>`.
- `generator/lib/templates/index.html` — new page structure (sidebar + content grid, mobile toggle button, new stylesheet/script `<link>`/`<script>` tags).
- `generator/lib/templates/monster.html` — creature card restructured from `<table>` to a stat grid.

**New (hand-authored, not part of the generation pipeline — same pattern as the existing `docs/atweaks.css`):**
- `docs/monsters.css`
- `docs/monsters.js`

### 5. Testing / rollout

`generator/lib/src/services/pipeline.golden.test.ts` does an exact byte-diff of the generated `docs/monsters.html` against the committed file. This test **will fail** immediately after implementation until:
1. The generator is run (`npm run atweaks` from `generator/`) to regenerate `docs/monsters.html` with the new templates.
2. The newly generated `docs/monsters.html` is reviewed and committed as the new golden snapshot.

This is expected and not a regression to "fix around" — it's called out here so it isn't mistaken for a broken test during implementation.

No other generated output (`.tpa`, `.baf`, `.tra` files) is affected by this change — only `docs/monsters.html` and the two new hand-authored static assets.
