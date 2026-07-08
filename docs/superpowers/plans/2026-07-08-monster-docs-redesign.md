# Monster Documentation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the generated bestiary page (`docs/monsters.html`) with a nested family→creature navigation menu and a fresh, responsive visual theme.

**Architecture:** Keep the existing `{{token}}` string-replacement templating in `documentation.service.ts` — only change the markup it assembles. The family menu becomes a per-family `<details>` accordion listing every creature (not just the first). Two new hand-authored static assets (`docs/monsters.css`, `docs/monsters.js`, mirroring how `docs/atweaks.css` already exists today) give the page its own independent look, replacing `atweaks.css` for this page only. `monsters.js` is a small progressive-enhancement layer (mobile drawer toggle + scrollspy) — the menu fully works via native HTML without it.

**Tech Stack:** TypeScript (generator), vitest (tests), plain HTML/CSS/vanilla JS (no build step, no frameworks) for the generated page and its static assets.

## Global Constraints

- No new template engine — `documentation.service.ts`'s existing `{{token}}` replace-or-throw mechanism (`private replace()`) stays exactly as is; only the HTML strings passed through it change.
- No change to *what* data is displayed per creature (same fields, same order) — presentation only, per the approved spec.
- `docs/atweaks.css` and the other static docs pages (`index.html` [Jekyll site], `atweaks_instructions.html`, etc.) are untouched — this redesign is scoped to `docs/monsters.html` and its own new assets only.
- `docs/monsters.css` / `docs/monsters.js` are hand-authored static files, not part of the generation pipeline (same as the existing `docs/atweaks.css` today) — nothing in `documentation.service.ts` writes them.
- Run all commands from `generator/` (the repo's working directory for this project) unless a step says otherwise; git commands that touch paths outside `generator/` must run from the repo root (`c:/Games/Baldur's Gate Enhanced Edition/aTweaks`), noted per-step.

---

### Task 1: Nested family menu + stat-grid special row in `documentation.service.ts`

**Files:**
- Modify: `lib/src/services/doc/documentation.service.ts`
- Create: `lib/src/services/doc/documentation.service.test.ts`

**Interfaces:**
- Produces: `documentationService.getFamilyMenu(family: Family): string` — new public method, returns one `<li class="family">` accordion block listing every creature in the family. Used internally by `addFamily`.
- Consumes (existing, unchanged signatures): `Family` from `../../model/creature/family`, `Creature` from `../../model/creature/creature`, `MonsterFamilyEnum` from `../../../creatures/monster`, `translationService.from(ref)` from `../translation.service`.

- [ ] **Step 1: Write the failing tests**

Create `lib/src/services/doc/documentation.service.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { Creature } from "../../model/creature/creature";
import { Family } from "../../model/creature/family";
import documentationService from "./documentation.service";

describe("getFamilyMenu", () => {
  it("builds a collapsible family entry linking to every creature in the family", () => {
    const family = {
      id: MonsterFamilyEnum.Bear,
      creatures: [
        { id: 4, name: "monster.bear.name.black" },
        { id: 5, name: "monster.bear.name.brown" },
      ],
    } as unknown as Family;

    expect(documentationService.getFamilyMenu(family)).toBe(
      '<li class="family"><details><summary>Bear</summary><ul>' +
        '<li><a href="#m4">Black Bear</a></li>' +
        '<li><a href="#m5">Brown Bear</a></li>' +
        "</ul></details></li>",
    );
  });

  it("produces an empty creature list for a family with no creatures", () => {
    const family = {
      id: MonsterFamilyEnum.Bear,
      creatures: [],
    } as unknown as Family;

    expect(documentationService.getFamilyMenu(family)).toBe(
      '<li class="family"><details><summary>Bear</summary><ul></ul></details></li>',
    );
  });
});

describe("addSpecial", () => {
  it("renders a caster special row as a stat-grid entry", () => {
    const creature = {
      data: { level1: { type: "caster", value: 9 } },
    } as unknown as Creature;
    const template = { text: "{{special}}" };

    documentationService.addSpecial(template, creature);

    expect(template.text).toBe(
      '<div class="stat"><dt>Special</dt><dd>Cast spells as a level 9 caster</dd></div>',
    );
  });

  it("renders a turn-undead special row as a stat-grid entry", () => {
    const creature = {
      data: { level1: { type: "turn", value: 3 } },
    } as unknown as Creature;
    const template = { text: "{{special}}" };

    documentationService.addSpecial(template, creature);

    expect(template.text).toBe(
      '<div class="stat"><dt>Special</dt><dd>Turned as a level 3 undead</dd></div>',
    );
  });

  it("renders nothing when the creature has no special casting/turning trait", () => {
    const creature = {
      data: { level1: { type: undefined, value: 0 } },
    } as unknown as Creature;
    const template = { text: "{{special}}" };

    documentationService.addSpecial(template, creature);

    expect(template.text).toBe("");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- documentation.service` (from `generator/`)
Expected: FAIL — `documentationService.getFamilyMenu is not a function`, and the `addSpecial` assertions fail because the current implementation still emits `<tr><th>Special</th><td>...</td></tr>`.

- [ ] **Step 3: Implement `getFamilyMenu` and refactor `addFamily`**

In `lib/src/services/doc/documentation.service.ts`, replace the current `addFamily` method:

```ts
  addFamily(family: Family) {
    this.families.push(
      `<li><a href="#m${family.creatures[0].id}">${
        MonsterFamilyEnum[family.id]
      }</a></li>`,
    );
    for (const creature of family.creatures) {
      this.addCreature(creature);
    }
  }
```

with:

```ts
  getFamilyMenu(family: Family): string {
    const links = family.creatures
      .map(
        (creature) =>
          `<li><a href="#m${creature.id}">${translationService.from(
            creature.name,
          )}</a></li>`,
      )
      .join("");
    return `<li class="family"><details><summary>${
      MonsterFamilyEnum[family.id]
    }</summary><ul>${links}</ul></details></li>`;
  }

  addFamily(family: Family) {
    this.families.push(this.getFamilyMenu(family));
    for (const creature of family.creatures) {
      this.addCreature(creature);
    }
  }
```

- [ ] **Step 4: Implement the `addSpecial` markup change**

In the same file, replace:

```ts
    if (special) {
      special = `<tr><th>Special</th><td>${special}</td></tr>`;
    }
```

with:

```ts
    if (special) {
      special = `<div class="stat"><dt>Special</dt><dd>${special}</dd></div>`;
    }
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- documentation.service` (from `generator/`)
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
git add lib/src/services/doc/documentation.service.ts lib/src/services/doc/documentation.service.test.ts
git commit -m "feat: nest creature links under each family in the docs menu"
```

(Run from `generator/` — this stages files inside the repo working tree correctly since `generator/` is a subdirectory of the git root, not a separate repo.)

---

### Task 2: New page templates, stylesheet, and script

**Files:**
- Modify: `lib/templates/monster.html`
- Modify: `lib/templates/index.html`
- Create: `../docs/monsters.css` (i.e. `docs/monsters.css` at the repo root, alongside the existing `docs/atweaks.css`)
- Create: `../docs/monsters.js` (i.e. `docs/monsters.js` at the repo root)

**Interfaces:**
- Consumes: the token set produced by `documentation.service.ts`'s `replace()` calls — `id`, `name`, `str`, `dex`, `con`, `int`, `wis`, `cha`, `align`, `ac`, `movement`, `hitDice`, `thac0`, `apr`, `special`, `size`, `morale`, `xp`, `attacks`, `traits`, `abilities` (in `monster.html`) and `families`, `monsters`, `traits` (in `index.html`). Every token must appear in the template exactly as named or `documentationService.generate()`/`addCreature()` will throw (`private replace()` throws if a token is missing).
- Produces: no new tokens — this task only changes the surrounding HTML/CSS/JS, not the token contract.

- [ ] **Step 1: Rewrite `lib/templates/monster.html`**

```html
<div class="creature" id="{{id}}">
  <h3>{{name}}</h3>
  <dl class="stat-grid">
    <div class="stat"><dt>Ability Scores</dt><dd>STR {{str}}, DEX {{dex}}, CON {{con}}, INT {{int}}, WIS {{wis}}, CHA {{cha}}</dd></div>
    <div class="stat"><dt>Alignment</dt><dd>{{align}}</dd></div>
    <div class="stat"><dt>Base Armor Class</dt><dd>{{ac}}</dd></div>
    <div class="stat"><dt>Movement</dt><dd>{{movement}}</dd></div>
    <div class="stat"><dt>Hit Dice</dt><dd>{{hitDice}}</dd></div>
    <div class="stat"><dt>THAC0</dt><dd>{{thac0}}</dd></div>
    <div class="stat"><dt>Attacks per Round</dt><dd>{{apr}}</dd></div>
    {{special}}
    <div class="stat"><dt>Size</dt><dd>{{size}}</dd></div>
    <div class="stat"><dt>Morale</dt><dd>{{morale}}</dd></div>
    <div class="stat"><dt>XP Value</dt><dd>{{xp}}</dd></div>
  </dl>
  <div class="detail-section">
    <h4>Attacks</h4>
    {{attacks}}
  </div>
  <div class="detail-section">
    <h4>Traits</h4>
    {{traits}}
  </div>
  {{abilities}}
</div>
```

- [ ] **Step 2: Rewrite `lib/templates/index.html`**

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>PnP creatures</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="monsters.css" rel="stylesheet" type="text/css" />
</head>

<body>
  <div class="topbar">
    <button class="menu-toggle" type="button" aria-label="Toggle creature menu">☰ Creatures</button>
  </div>
  <div class="backdrop"></div>
  <header class="intro">
    <h1>PnP creatures</h1>
    <p>
      This component brings all creatures in the game closer to their
      <abbr title="Pen and Paper">PnP</abbr> counterparts. Legitimately
      missing abilities are restored and spuriously granted benefits are
      removed. For this purpose, the AD&amp;D Monstrous Manual and the
      Monstrous Compendium were used as reference. The creatures'
      <abbr title="Artificial Intelligence">AI</abbr> has been improved
      as well, and it now allows them to act in accordance with the
      behavior described in the source books. In effect, these changes
      may increase or decrease the difficulty of dealing with these
      creatures.
    </p>
  </header>
  <div class="layout">
    <nav class="sidebar">
      <ul>{{families}}</ul>
    </nav>
    <main class="content">
      {{monsters}}
      <section class="traits-glossary">
        <h2>Traits</h2>
        <div class="traits">{{traits}}</div>
      </section>
    </main>
  </div>
  <script src="monsters.js" defer></script>
</body>

</html>
```

- [ ] **Step 3: Sanity-check every token survived the rewrite**

Run (from `generator/`):

```bash
grep -o '{{[a-zA-Z]*}}' lib/templates/index.html | sort -u
```
Expected output:
```
{{families}}
{{monsters}}
{{traits}}
```

```bash
grep -o '{{[a-zA-Z]*}}' lib/templates/monster.html | sort -u
```
Expected output:
```
{{abilities}}
{{ac}}
{{align}}
{{apr}}
{{attacks}}
{{cha}}
{{con}}
{{dex}}
{{hitDice}}
{{id}}
{{int}}
{{morale}}
{{movement}}
{{name}}
{{size}}
{{special}}
{{str}}
{{thac0}}
{{traits}}
{{wis}}
{{xp}}
```

If any token is missing or misspelled compared to this list, fix the template before continuing — `documentationService` will throw `Token {{x}} not found !` at generation time otherwise.

- [ ] **Step 4: Create `docs/monsters.css`**

Create `../docs/monsters.css` (path relative to `generator/`; this lands at `docs/monsters.css` in the repo root):

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --bg-alt: #f3f4f6;
  --text: #1a1a1a;
  --text-muted: #59595f;
  --accent: #6d28d9;
  --accent-contrast: #ffffff;
  --border: #e2e2e6;
  --card-bg: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14151a;
    --bg-alt: #1c1e24;
    --text: #e8e8ec;
    --text-muted: #a5a5b0;
    --accent: #a78bfa;
    --accent-contrast: #14151a;
    --border: #2c2e36;
    --card-bg: #1c1e24;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

h1, h2, h3, h4, h5 {
  line-height: 1.25;
}

h5 {
  font-size: 1rem;
  margin: .75rem 0 .25rem;
}

a {
  color: var(--accent);
}

abbr {
  text-decoration-style: dotted;
  cursor: help;
}

.topbar {
  display: none;
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg-alt);
  border-bottom: 1px solid var(--border);
  padding: .75rem 1rem;
  align-items: center;
}

.menu-toggle {
  background: var(--accent);
  color: var(--accent-contrast);
  border: none;
  border-radius: .375rem;
  padding: .5rem .75rem;
  font-size: 1rem;
  cursor: pointer;
}

.backdrop {
  display: none;
}

.intro {
  max-width: 70ch;
  margin: 1.5rem auto 0;
  padding: 0 1.5rem;
}

.intro h1 {
  font-size: 1.75rem;
  margin-bottom: .5rem;
}

.intro p {
  color: var(--text-muted);
}

.layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: 1.5rem;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding-right: .5rem;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar > ul > li.family {
  margin-bottom: .25rem;
}

.sidebar summary {
  cursor: pointer;
  font-weight: 600;
  padding: .4rem .5rem;
  border-radius: .375rem;
  list-style: none;
}

.sidebar summary::-webkit-details-marker {
  display: none;
}

.sidebar summary:hover {
  background: var(--bg-alt);
}

.sidebar details[open] > summary {
  color: var(--accent);
}

.sidebar ul ul {
  padding-left: .75rem;
  border-left: 1px solid var(--border);
  margin: .25rem 0 .5rem .5rem;
}

.sidebar ul ul li a {
  display: block;
  padding: .3rem .5rem;
  border-radius: .375rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: .9rem;
}

.sidebar ul ul li a:hover {
  background: var(--bg-alt);
  color: var(--text);
}

.sidebar ul ul li a.active {
  background: var(--accent);
  color: var(--accent-contrast);
}

.content {
  min-width: 0;
}

.creature {
  border: 1px solid var(--border);
  border-radius: .5rem;
  background: var(--card-bg);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
}

.creature h3 {
  margin-top: 0;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: .5rem 1.5rem;
  margin: 1rem 0;
  padding: 0;
}

.stat-grid .stat {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px dashed var(--border);
  padding: .25rem 0;
}

.stat-grid .stat dt {
  color: var(--text-muted);
  font-weight: 600;
  margin: 0;
}

.stat-grid .stat dd {
  margin: 0;
  text-align: right;
}

.detail-section {
  margin-top: 1rem;
}

.detail-section h4,
.abilities h4 {
  font-size: 1rem;
  margin: 0 0 .5rem;
}

.detail-section hr {
  border: none;
  border-top: 1px dashed var(--border);
  margin: .75rem 0;
}

.weapon,
.abilities,
.traits {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.traits-glossary {
  margin-top: 2rem;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .topbar {
    display: flex;
  }

  .layout {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .intro {
    padding: 0 1rem;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 85%;
    max-width: 320px;
    max-height: 100vh;
    background: var(--bg);
    z-index: 30;
    padding: 1rem;
    transform: translateX(-100%);
    transition: transform .2s ease;
    border-right: 1px solid var(--border);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .backdrop.open {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 25;
  }
}
```

- [ ] **Step 5: Create `docs/monsters.js`**

Create `../docs/monsters.js` (path relative to `generator/`; lands at `docs/monsters.js` in the repo root):

```js
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var sidebar = document.querySelector(".sidebar");
  var backdrop = document.querySelector(".backdrop");

  function closeDrawer() {
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }

  function openDrawer() {
    if (sidebar) sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
  }

  if (toggle && sidebar && backdrop) {
    toggle.addEventListener("click", function () {
      if (sidebar.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
    backdrop.addEventListener("click", closeDrawer);
    var menuLinks = sidebar.querySelectorAll("a");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", closeDrawer);
    }
  }

  var creatures = document.querySelectorAll(".creature");
  var sidebarLinks = document.querySelectorAll(".sidebar ul ul a");

  function setActive(id) {
    for (var i = 0; i < sidebarLinks.length; i++) {
      var link = sidebarLinks[i];
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", isActive);
      if (isActive) {
        var details = link.closest("details");
        if (details) details.open = true;
      }
    }
  }

  if (creatures.length && sidebarLinks.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) setActive(entries[i].target.id);
        }
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );
    for (var j = 0; j < creatures.length; j++) {
      observer.observe(creatures[j]);
    }
  }
})();
```

- [ ] **Step 6: Commit**

Run from the repo root (`c:/Games/Baldur's Gate Enhanced Edition/aTweaks`), since `docs/monsters.css`/`docs/monsters.js` live outside `generator/`:

```bash
git add generator/lib/templates/monster.html generator/lib/templates/index.html docs/monsters.css docs/monsters.js
git commit -m "feat: new responsive layout and stylesheet for the monster docs page"
```

---

### Task 3: Regenerate, update the golden snapshot, and verify in a browser

**Files:**
- Modify (regenerated, not hand-edited): `../docs/monsters.html`

**Interfaces:**
- Consumes: Tasks 1 and 2's changes, exercised end-to-end via the real generator pipeline (`mainService.generateCreatures()` → `documentationService`).

- [ ] **Step 1: Confirm the golden test currently fails (proves the output actually changed)**

Run: `npm test -- pipeline.golden` (from `generator/`)
Expected: FAIL on `regenerates docs/monsters.html identically` (and PASS on everything else) — the committed `docs/monsters.html` still has the old markup, but the pipeline now generates the new markup from Tasks 1–2.

- [ ] **Step 2: Regenerate real output**

Run: `npm run atweaks` (from `generator/`)

This overwrites `../docs/monsters.html` (and re-derives every other generated file, though only `docs/monsters.html` should actually differ — Task 1/2 changes are confined to the documentation service and templates).

- [ ] **Step 3: Confirm only the documentation file changed**

Run from the repo root:

```bash
git status --short
```
Expected: only `docs/monsters.html` shows as modified (`M docs/monsters.html`). If any `.tpa`, `.baf`, or `.tra` file also shows as modified, stop and investigate before continuing — Task 1/2 should not touch WeiDU/BAF/translation output.

- [ ] **Step 4: Run the full test suite to confirm the golden snapshot now matches**

Run: `npm test` (from `generator/`)
Expected: PASS — all suites green, including `pipeline.golden.test.ts`'s `docs/monsters.html` case (it now compares the freshly generated tempDir output against the just-regenerated file on disk, which match).

- [ ] **Step 5: Manually verify the page in a browser**

Open `../docs/monsters.html` (from `generator/`) directly in a browser, e.g.:

```bash
start "../docs/monsters.html"
```

Check, resizing the window as needed:
- Desktop width (>768px): sidebar is visible and sticky; each family is collapsed by default; clicking a family summary expands/collapses its creature list; clicking a creature link jumps to its card and highlights that link in the menu.
- Scroll through a couple of families' creatures without clicking any link: the corresponding family auto-expands and the active link updates as you scroll (scrollspy).
- Narrow the window below ~768px: the sidebar disappears and a "☰ Creatures" button appears in a top bar; clicking it slides the menu in as an overlay with a dimmed backdrop; clicking a creature link or the backdrop closes it again.
- Toggle your OS/browser dark mode preference: the page switches between the light and dark palettes without a page reload.
- Confirm a creature with special abilities (e.g. a spellcaster) still shows its "Special" row, attacks, traits, and abilities sections with readable formatting (line breaks preserved, no horizontal overflow).

- [ ] **Step 6: Commit the regenerated documentation**

Run from the repo root:

```bash
git add docs/monsters.html
git commit -m "chore: regenerate docs/monsters.html with the new layout"
```
