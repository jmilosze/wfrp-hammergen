# UI issues

How the app looks and feels: layout, components, texts and interaction. Rules and the next free ID are in [README.md](README.md).

## Bugs

### HG-20 Open tabs after an API change
Frontend · 2026-09-30

The maintenance page now polls `/api/status` and reloads the tab when maintenance ends. Still open: tabs that never saw a maintenance 503 keep running the old frontend after a frontend/backend shape change (would need a version check, e.g. comparing a build id from the API with the one in the bundle).

## Features

### HG-15 One standard picker (select table)
Frontend · 2026-10-03

The pickers used to choose content (trappings, skills, talents, traits, qualities and flaws…) come in many variants that don't look good together: `SelectTable` (checkbox), `SelectIdNumberTable` (number in the modal), `SelectIdValueTable` (value in the page table, "Add" for repeatable entries), plus the character editor's `CharacterSkills`, `CharacterTalents`, `CharacterItems` and `CharacterCareer`. Goal: one convenient, better-looking pattern. Purely UX. The popups are already one component (`ChecklistPicker`, R5 of `docs/ui-refactoring.md`); what differs is the tables on the page.

### HG-42 Trappings without a price
Frontend · 2026-10-16

Some trappings have no price (e.g. an asset like a servant). The data already allows it (price 0), but it reads as costing 0 (`printPrice` in `utils/currency.ts` prints "0d", the editor shows 0/0/0 coins). Treat 0 as "no price": show "–" instead of a price, and in the trapping editor offer a "No price" option that clears the coin fields. Note: since the UI redesign the trappings list no longer shows prices and `printPrice` is unused, so the price is only visible in the editor; bring it back to the list (and the trapping view) as part of this.

## Ideas

### HG-55 Career and species marks in the character editor's tables
Frontend · 2026-10-23

The skills, talents and trappings popups show what the current career, species and class give in the rows' notes (`services/wh/character/marks.ts`), and the characteristics table highlights the career characteristics. The editor's own Skills, Talents and Trappings tables (the character's items) don't show these marks yet. Showing them there too (e.g. a short "Career" / "Species" note under the name) would let players see at a glance which of their skills and talents they can still advance at career cost. Left for later when the popup marks were added.

### HG-41 Faster rendering of long picker lists
Frontend · 2026-10-16

`components/picker/ChecklistPicker.vue` renders every item of the list at once, while the content list pages page through results (`BrowseList.vue` with `TablePagination`). With a few hundred more trappings (HG-59) opening and searching the trappings picker may get slow. Measure first with the current lists (render time of the trappings picker, 5e character with 4e content allowed); if it is slow, options are paging like the list pages, a virtual list (`useVirtualList` from `@vueuse/core`, already a dependency; needs fixed row heights) or showing the first N matches with "show more". The type filters of the pickers also shorten the lists.
