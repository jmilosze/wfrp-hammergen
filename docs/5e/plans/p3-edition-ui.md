# Plan P3 — Edition in the UI (browse and edit content per edition)

Status: **in progress** (2026-10-01). Tracker items: C4, C5.

## Goal

Users can browse content of either edition and create/edit both edition variants of a document. Characters are not part of this (phase 3.2): they stay 4e.

## Decisions (2026-10-01)

1. **Global edition switch** (4e | 5e) in the navigation, remembered in the browser (localStorage). Content lists and content editors follow it.
2. **Default 4e** for new visitors; revisit when 5e content is imported (C6b).
3. **Lists show one edition**: documents that have the selected variant, showing that variant.
4. **Editor: one page per document with a 4e | 5e toggle.** The form shows the selected variant with that edition's fields and options; **Save writes all variants in one PUT/POST.**
5. The editor **opens on the global edition**.
6. **Missing variant:** "This item has no 5e version" + **"Add 5e version"**, which **pre-fills from the other variant** (6b), adjusted to the edition's rules (see Steps 4).
7. **Create:** a new document starts in the global edition; the other variant can be added before or after the first save.
8. **Delete always deletes the whole document** (all variants), on the edit page and on the list page (revised 2026-10-01; deleting a single variant was not useful). The API still supports `DELETE ?edition=` but the UI does not use it.
9. **Copy on the list page copies the whole document** (all variants).
10. **Public documents stay admin-only**, including adding variants; users copy them first.

## Scope

Not in scope: characters (list, editor, sheet, generator keep using 4e content); edition in URLs; 5e default.

## Steps

### 1. Global edition
- `useEdition()` composable: a single app-wide `edition` ref, read from/written to localStorage (default `4e`).
- Switch in the navigation (4e | 5e).
- Character-related code keeps a fixed `CHARACTER_EDITION = "4e"` (character editor, sheet, generator content lists). `UI_EDITION` is removed.

### 2. API layer
- Converters take the edition: `apiResponseToModel(api, edition)`.
- `WhApi`: list/get take the edition (as now); new document-level calls for the editor and copy: get all variants (`GET` without edition) as `Partial<Record<Edition, T>>`, and create/update with several variants (`{visibility, editions}`); delete takes an optional edition.

### 3. Lists (C4)
- `useWhList(api, edition)` loads the given edition and reloads when it changes; content list pages pass the global edition, character pages pass `CHARACTER_EDITION`.
- Group/source filter options follow the edition.
- Copy copies all variants.

### 4. Editor (C5)
- `useWhEdit` keeps one model per variant plus the selected edition; `wh` is the selected variant's model, so the existing forms keep binding to `wh`.
- Toggle 4e | 5e at the top of every content edit page; "Add <edition> version" when missing.
- Pre-fill: copy of the other variant, adjusted by a per-type `forEdition(e)` (e.g. 5e talent: no tests, no characteristic bonuses, max rank ≥ 1; 5e career: only 5e species; item: group reset if not in the edition's list; modifiers: effects not in the edition dropped; sources reset to the edition's default).
- Edition-specific fields: forms read the selected edition (talent tests/bonus inputs hidden for 5e; effect, source, group and species options per edition).
- Save sends all variants; delete deletes the whole document.
- Frontend validation mirrors the edition rules enforced by the API (so 5e saves don't fail with 400), the way 4e pages do it: options that would be invalid are not offered (effects, groups, species, sources; 5e talent bonus inputs and tests hidden), and where a value can't be restricted the field shows a validation error and save is blocked (`isValid(edition)`; 5e non-group talent max rank ≥ 1).

### 5. Tests
- Unit tests for `useEdition`, converters with edition, document-level API calls, `forEdition` per type, whEdit variant handling.
- Manual check in the browser against a local API: switch edition, list, create/edit/copy/delete with both variants.

## Done when
- Lists and editors work for both editions; characters are unchanged.
- A document can be created, extended with a second variant (pre-filled), edited and saved with both variants, and deleted.
- 4e behaviour for users who never touch the switch is unchanged.
