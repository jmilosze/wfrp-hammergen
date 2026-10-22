# Plan: values on character trappings (HG-49, HG-40 D17–D19)

A character's trappings get a value next to the id and the number, like traits (`IdValue`), shown as "Hand Weapon (Axe)". Needed by HG-40: career trappings carry notes ("Axe", "with a Footman", "Letter of Appointment") that the generator puts on the character. Work-plan step 2a in [README.md](README.md). Agreed 2026-10-20, deployed 2026-10-21. The sections below describe the plan as written; where the result differs (rows are never merged, the Note popup, the ⋯ menu), the bullets marked "changed" and the "Decided" section say so.

## Today

- Backend: `EquippedItems`, `CarriedItems`, `StoredItems` are `[]IdNumber` (`domain/warhammer/character.go`); stored as `{id, number}` in the character document; `ToFull` turns them into `[]WhNumber` (`idNumberListToWhNumberList`).
- Frontend: the API type uses `IdNumber[]`, but the model (`Character` in `services/wh/character/character.ts`) keeps each place as `Record<id, number>`, so a trapping appears at most once per place. Code that relies on the record:
  - `character.ts`: constructor, `validate*Items`, `updateItems`, API conversion (`idNumberArrayToRecord`, `Object.entries`), `isEqualTo`.
  - `components/character/edit/CharacterItems.vue`: the three sections, moves (Equip, Unequip, Store, Carry), quantity input, remove, the picker popup (quantity per id).
  - `CharacterWealthEncumbrance.vue` (encumbrance in the editor), `encumbrance.ts` (`encumbranceItems(selected: Record<…>)`).
  - Generator: `generation/shared/trappings.ts` (`generateClassItems` returns `Record<id, number>`, `populateClassItems` uses `fillUpIdNumberRecord`), `generator4e.ts`, `generator5e.ts`.
  - Sheet and CSV read `CharacterFull` (`characterFull.ts`: `getItems`, `CharacterFullItem`), `ViewCharacterTrappings.vue`, `csv4e.ts`, `csv5e.ts`.
- Traits already do the same for one list: `traits: IdValue[]`, the same trait more than once, `SelectIdValueTable.vue` with a value input, `printWithValue` on the sheet, `MAX_VALUE_LENGTH` 20.

## Proposal

Data:
- New type `IdNumberValue` `{id, number, value}` in Go (`domain/warhammer/common.go` or `character.go`) and TypeScript (`utils/`, next to `idNumber.ts`); used for the three trapping lists only. Go: `Value string \`json:"value" bson:"value,omitempty" validate:"item_value_valid"\``, alias `item_value_valid` = `max=40,excludesall=<>` (D18). Traits keep 20.
- An entry is a row: a trapping with one value and a number. The same trapping can have several rows, with the same or different values. The order is not meaningful.
- Existing characters have no `value`: read as empty. No data migration, no change for the characters' owners.
- `ToFull`: `[]WhNumberValue` for the items, so `CharacterFull` knows the value.

Frontend model:
- `equippedItems`, `carriedItems`, `storedItems` become `IdNumberValue[]` (like `traits`), no more `Record`.
- Helpers in one topic file (`utils/idNumberValue.ts`): find an entry by id and value, add a number to an entry (creating or removing it), merge entries with the same id and value. Used by the model, the editor and the generator.
- `updateItems(id, value, number, location)` sets the number of that entry (0 removes it); `updateItemValue(location, index, value)` changes the value (merging with an existing entry of the same id and value happens when the character is saved, as for the API conversion, so typing doesn't jump rows).
- Validation: numbers 1–1000 as today; values with `validateValues` and a length parameter (40).
- `isEqualTo`: the three lists are order-insensitive (option of `testIsEqualTo`).

Editor (`CharacterItems.vue`, both editions):
- Each row shows the name with its value under it in small grey text (as the hints in the editor, e.g. the career ticks), and a Note button that opens a small popup to edit the value (at most 40 characters; Save or Enter sets it, trimmed; Cancel keeps it). Changed 2026-10-20 from an always visible field. In a narrow card (phones) a row is the name and note, a "⋯" menu with the row's buttons (Note and the moves; `components/ui/ActionMenu.vue`), the quantity and the remove cross.
- Moves keep the value: Equip on "Hand Weapon (Axe)" moves one Hand Weapon (Axe).
- Rows are keyed by id and value, sorted by name and then value.
- The picker popup has no quantities (changed 2026-10-20): like traits that take a value, every trapping has Add, which adds a new row (quantity 1, no value) each time, and shows "×N" for how many rows of it the list has; a trapping counts as selected with or without values. Quantities are edited in the trappings' rows, values in the Note popup.

Sheet, print and CSV:
- The name shows the value in brackets, "Hand Weapon (Axe)", for every trapping with a value (`printWithValue` with `hasValue` true), in all trapping tables and in the CSV exports of both editions.

Encumbrance: unchanged rules; it reads entries instead of the record.

Generator:
- `generateClassItems` and the career trappings (HG-40 step 7) return entries; adding them to the character merges by id and value. A career trapping's note becomes the entry's value.

Tests:
- Go: validation (value length, `<>`), `ToFull` with values, a character without values.
- Frontend: the helpers; `character.spec.ts` (API conversion both ways, merging, validation, `isEqualTo` with the option); `CharacterItems.spec.ts` (value field, moves keep the value, two Hand Weapons with different values, picker adds an entry without a value); `encumbrance.spec.ts`; `trappings.spec.ts`; CSV specs if they cover trappings; the sheet shows "Hand Weapon (Axe)".

Docs: `docs/architecture.md` (characters: trapping values); HG-49 is done and removed from the backlog.

## Decided (2026-10-20)

1. The career format names a trapping's note `value` too, so the generator copies it as it is.
2. The character values come first, as their own change and deploy; the career trappings (HG-40 steps 3–7) follow.
3. Rows are never merged on save or load (changed 2026-10-20): every row stays as it was added, also two identical ones (two Agurk rows of 1). Moving one between Equipped, Carried and Stored joins an identical row at the destination if there is one.
