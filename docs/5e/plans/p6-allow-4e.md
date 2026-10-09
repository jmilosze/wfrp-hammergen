# Plan P6 — "Allow 4e content" on 5e characters

Status: **implemented** (2026-10-08); browser walkthrough passed on a local API against today's production snapshot (switch with confirmation, then disabled; pickers with 4e badges and 5e/4e filter; 4e career, talent with modifiers, weapon and spell; warning in editor, sheet and CSV; API refuses turning the switch off; 4e characters unchanged). Not deployed. Tracker items: O1–O4.

## Goal

A 5e character can opt in to 4e content, for things 5e does not have yet (supplement careers, spells, trappings, talents…). 4e characters are not affected (R4); characters without the switch work exactly as today.

## Decisions (2026-10-08)

- **The switch (R6):** a 5e character has an "Allow 4e content" switch. It can be turned on when creating the character or later in the editor, and **cannot be turned off** once on. The API refuses an update that turns it off.
- **Which 4e content (R7):** a document that has **only a 4e variant** (no 5e version). This includes the user's own custom 4e content. 4e content that has a 5e version is not offered: the 5e version is used.
- **Effect on numbers (R8, refined):**
  - **Trappings count fully**, using their 4e stats: encumbrance, weapon damage and range, armour AP, qualities and flaws.
  - **Talents, traits, mutations:** shown; their modifiers (characteristics, size, movement, Hardy/Strong Back/Sturdy) are **not** applied.
  - **Skills:** shown with their advances; the value is calculated as usual (5e characteristic + advances). It does not change anything else.
  - **Careers:** a 4e-only career can be the current or a past career (status and standing are typed in anyway).
  - **Spells, prayers:** shown as they are (no calculations).
- **Display:** 4e content is marked "(4e)" on the sheet, in print and CSV, and with a "4e" badge in the editor.
- **Warning about ignored modifiers (2026-10-08):** when the character has 4e talents, traits or mutations that have modifiers (characteristics, size, movement or effects such as Hardy), the editor and the sheet show a warning that these modifiers are not taken into account, naming the entries. No warning when none of the 4e entries has modifiers.
- **Pickers:** 4e entries are mixed into the same list with a "4e" badge, with a filter: 5e only / 4e only / both.
- **Toggle placement:** a checkbox near the top of the 5e editor; turning it on asks for confirmation ("this cannot be undone").
- **Light validation:** the API only enforces the one-way switch. It does not check that a 5e character without the switch has no 4e references (the editor does not offer them).
- **Generator:** not affected; it uses 5e content only (R9).

## How it works today (relevant parts)

- Lists and full characters are loaded per edition: `listElements(edition)` returns documents that have that edition's variant; `retrieveFullCharacters` loads referenced content with the character's edition, so a 4e-only document referenced by a 5e character is not resolved.
- The frontend picks a document's variant with `variant(wh, edition)`, which throws when the variant is missing.

## Stages

### 1. Model and API (O1)

- `Character` (Go, TS) gets `allow4e bool` (`allow4e` in JSON, `allow4e` in BSON, `omitempty`).
- `extraCharacterValidation` / `ValidateEdition`: `allow4e` only on 5e characters; on update, refuse turning it from on to off (compare with the stored character, as the edition-change check does).
- Full character (`retrieveFullCharacters`, `Character.ToFull`): for a 5e character with `allow4e`, referenced content is loaded without the edition filter and each reference resolves to its 5e variant, falling back to its 4e variant. The response keeps all variants of each document (as today), so the frontend can tell which one applies.
- Go tests: one-way switch, `allow4e` on a 4e character refused, a 4e-only reference resolved for a 5e character with the switch and not without it.

### 2. Shared helpers (frontend)

- `contentEdition(wh, characterEdition)`: the edition whose variant applies to the character (5e if present, else 4e when allowed).
- `variantFor(wh, characterEdition)`: that variant; used instead of `variant(wh, e)` in the full-character builder.
- A small "4e" badge component.

### 3. Editor pickers (O2)

- With the switch on, each picker of the 5e editor (skills, talents, careers, trappings, spells, prayers, traits, mutations) loads the 5e list **and** the 4e list, and adds the 4e entries whose id is not in the 5e list, with a "4e" badge.
- A filter on each picker: 5e only / 4e only / both (default both).
- The "Allow 4e content" checkbox with the confirmation dialog; once on it is shown checked and disabled.
- Modifiers: the editor's calculated values (wounds, movement, size, characteristics) ignore the modifiers of 4e talents, traits and mutations.
- Warning (yellow alert) next to the calculated values and the characteristics: "Modifiers of 4e content are not taken into account: …" listing the 4e talents, traits and mutations that have modifiers; updates as entries are added or removed.

### 4. Sheet, print and CSV (O3)

- The full-character builder (`characterFull.ts`) uses `variantFor`, so 4e content resolves.
- Calculations: modifiers from 4e talents/traits/mutations are skipped; trappings are used as they are (encumbrance, damage, AP).
- 4e entries marked "(4e)" in every table and in the 5e CSV.
- The same warning about ignored 4e modifiers at the top of the sheet (shown in print too), naming the entries.

### 5. Tests (O4)

- Go: see stage 1.
- Frontend (vitest): `variantFor`/`contentEdition`; a full 5e character with a 4e talent (modifiers ignored) and a 4e trapping (counted in encumbrance); the list of 4e entries with ignored modifiers (used by the warning).

### 6. Browser walkthrough

On a local API against a copy of production: turn the switch on (confirmation, then disabled), add a 4e-only career, talent (with modifiers), spell and trapping, check the badges and filters, the ignored-modifiers warning in the editor and on the sheet, the sheet markers, wounds/encumbrance, print and CSV; check a 5e character without the switch and a 4e character are unchanged.

## Out of scope

- Converting 4e content to 5e (R10, future).
- Metrics for the switch (A4).
- 4e content in the 5e generator (R9).

## Open questions

None at the moment.
