# UI code refactoring

A survey of the frontend code (`src/frontend/src`) after the UI redesign (commit `8b1bd5e`), with a plan to reorganise
the components and a list of non-functional improvements. Nothing here is implemented yet. Every step is meant to
change no behaviour: same pages, same look, same rules. Bugs found during the survey are in `docs/issues.md`
(HG-28 to HG-31), not here.

## Where things stand

- `components/` is one flat folder of 71 files (66 `.vue`, 5 `.ts`). It mixes generic UI (buttons, alerts, modals),
  the paper-sheet look (`SheetTable`, `SectionCard`…), list-page parts, editor parts, pickers, character editor
  sections, character sheet sections and the app shell (`NavBar`, `SideBar`). Most of these files are used by one
  feature only: e.g. the 12 `ViewCharacter*` files are used only by the character view, the 6 `Character*` editor
  sections only by the two character editors and `AccountCard`/`AfterSubmit` only by the account pages.
- `views/Warhammer/` is split by kind of page (`List/`, `Edit/`, `Character/`), so `ListCharacters.vue` sits with the
  content lists, away from the other character pages. Content editors are called `Create*.vue` though they also view
  and edit.
- The 11 list pages (1,384 lines) repeat the same 37-line template and the same script setup. Only the title, route,
  API, row meta line and extra filters differ (e.g. `ListTraits.vue` and `ListPrayers.vue` differ only in names).
- The 10 content editors (2,102 lines) repeat the same shell: error alert, edition switch, header, missing-variant
  notice, visibility box, sources, Save/Delete blocks. About 60 lines each.
- `EditCharacter4e.vue` (772 lines) and `EditCharacter5e.vue` (741 lines) share about 60% of their lines, mostly
  loading eight content lists, eight copy-pasted error alerts, the identity/wealth/encumbrance/magic/corruption/notes
  tables and the Save/Delete blocks. By contrast `ViewCharacter4e.vue`/`ViewCharacter5e.vue` already share their
  parts and differ in only 57 lines: that is the model to follow.
- Two generations of components live side by side: the new `ChecklistPicker` and the old `TableWithSearch` (295
  lines, still used by `SelectIdNumberTable` and `CharacterModifierEffectTable`); the new `SectionButton` and the old
  `ActionButton`/`LinkButton` (used only by the list row actions).
- Modals are a global singleton (`composables/modal.ts`) addressed by string ids, teleported into `#modal`. To work
  with it, callers use tricks: `DeleteBlock` resets an object, waits a tick and sets it again so a deep watcher in
  `DeleteModal` opens the modal; pickers pass `opened`/`resetPagination` counters to reset their state; ids are made
  up with `crypto.randomUUID()`. The modal has no `role="dialog"`, no focus handling and doesn't close on Escape.
- Smaller repeats: the grey title band markup is copied in `SheetTable`, `SectionCard`, `EditControls`,
  `DeleteBlock` and `CreateItem`; the small ✕ remove button is copied in 11 components; the visibility slot of
  `BrowseList` is typed inline (`{ ownerId: string; visibility: number }`) on all 11 list pages.

## Proposed layout

Rule: `views/` holds route pages only. `components/` is grouped in folders: shared kinds of component (used by
several features) and one folder per feature for the parts of that feature's pages. A component used by one page
lives in that page's feature folder.

```
src/
  App.vue, main.ts, router.ts, style.css
  layout/                      app shell
    NavBar.vue, NavLink.vue, SideBar.vue, AnnouncementBar.vue, navigation.ts, announcement.ts
  components/
    ui/                        generic, no Warhammer knowledge
      AppButton.vue            (SectionButton)
      ButtonLink.vue           (SectionLink)
      IconButton.vue           (done in R6)
      buttonStyle.ts, TextLink.vue, AlertBlock.vue, SpinnerAnimation.vue, InfoTip.vue,
      ModalWindow.vue, HelpButton.vue (HintModal), ToggleSwitch.vue, TablePagination.vue, PageHeader.vue
    form/
      FormInput.vue, FormTextarea.vue,
      Checkbox.vue             (SheetCheckbox: also used by filters, not only sheets)
      LabelledCheckbox.vue     (CheckboxInput)
      CheckboxGroup.vue        (MultipleCheckboxColumnInput)
    sheet/                     the paper character sheet look
      SheetTable.vue, SheetField.vue, SheetSelect.vue, SheetCell.vue, SheetGroup.vue,
      SheetCard.vue            (SectionCard)
      SheetList.vue            (ListTable)
      SheetTitle.vue           (added in R6)
    picker/                    choosing content (HG-15)
      ChecklistPicker.vue, ChecklistRow.vue, checklistItem.ts,
      SelectTable.vue, SelectIdValueTable.vue, SelectIdNumberTable.vue,
      LabelPicker.vue, LabelChips.vue, LabelAddSelect.vue
    edition/
      EditionBadge.vue, Edition4eBadge.vue, EditionSwitch.vue
    editor/                    shared by content and character editors
      EditControls.vue, DeleteBlock.vue, DeleteModal.vue,
      VisibilityField.vue      (PublicPropertyBox)
    content/
      list/                    ContentListPage.vue (new), BrowseList.vue, browseRow.ts, FilterSidebar.vue,
                               filterSection.ts, VisibilityIcon.vue (ToolTip), visibilityKind.ts,
                               CopyButton.vue (ActionButtonsNonCharacter)
      edit/                    ContentEditorPage.vue (new), MissingEditionVariant.vue, SourceTable.vue,
                               ModifiersBlock.vue (CharacterModifiersBlock), ModifierEffectTable.vue
                               (CharacterModifierEffectTable), CareerLevel.vue, CareerReferencesTable.vue,
                               SpellClassification.vue
    character/
      CharacterRowActions.vue  (ActionButtonsCharacter), Ignored4eModifiersWarning.vue
      edit/                    CharacterAttributes, CharacterCareer, CharacterItems, CharacterSkills,
                               CharacterTalents, CharacterStartPanel (+ the shared sections from R3)
      sheet/                   the ViewCharacter* parts and CareerAdvancementTracker
    account/
      AccountCard.vue, AfterSubmit.vue
  views/
    Home/, About/              unchanged
    User/                      unchanged
    Content/
      List/                    ListCareers.vue … (one per type)
      Edit/                    EditCareer.vue … (renamed from Create*.vue)
    Character/
      ListCharacters.vue, EditCharacter.vue, EditCharacter4e.vue, EditCharacter5e.vue,
      ViewCharacter.vue, ViewCharacter4e.vue, ViewCharacter5e.vue
```

Notes:

- `TableWithSearch.vue` and `EditorEditionSelector.vue` disappear (R5, R2); `ActionButton.vue` and `LinkButton.vue`
  are gone (R6).
- `ToolTip.vue` is not a tooltip: it is the visibility icon of a list row. Its badge branch (`iconOnly` false) is
  never used and can go with the `badgeClass` values of `visibilityKind.ts`.
- `CharacterModifiersBlock` and `CharacterModifierEffectTable` are used by the talent, trait and mutation editors,
  not by characters; the new names say what they edit.
- Views are imported under their own names (29 files import `PageHeader.vue` as `Header`).
- The `manualChunks` in `vite.config.ts` match on `views/Warhammer/...` paths and must follow the move (see
  "Build and dependencies").
- `docs/architecture.md` (Frontend section) gets the new layout and the rule above.

## Refactors

Each one stands alone and can be done, checked and committed on its own. Sizes are rough: S under an hour, M a few
hours, L a day or more.

### R1 One list page component (M)

A `ContentListPage.vue` that renders the alert, header, filter sidebar, Create new links (both places), the
`BrowseList` with the visibility icon and the Copy button. Each `List*.vue` keeps only what is its own: the API, the
row meta line and its extra filters. The source filter (`splitQuery(useSourceQuery(edition))`, the `filters`
computed, the Source section) moves into a helper in `composables/whList.ts`. `BrowseRow` gets `ownerId` and
`visibility`, so the slot types stop being written inline. The `"Any source"` option, added by `whList.ts` and then
filtered out by every list page, goes. `ListCharacters.vue` uses the same component with its own row actions.

### R2 One content editor shell (M)

A `ContentEditorPage.vue` taking the `useWhEdit` result, the property name and the list route, with a slot for the
fields. It renders the API alert, edition switch, header, missing-variant notice, `VisibilityField`, `SourceTable`
and the Save/Delete row. The editors keep only their fields and validation. `EditorEditionSelector.vue` is folded
in.

### R3 Share the character editor's common parts (L)

Without touching 4e behaviour:

- A composable (e.g. `useCharacterContent` in `composables/characterEdit.ts`) that loads the eight content lists and
  the generation data for an edition, with one `loading` and one list of errors. The 5e editor builds on
  `useWith4eContentList` the same way. The eight copied alerts become one loop, which also fixes HG-29.
- Sections both editors render the same way move to `components/character/edit/`. Candidates, to compare line by
  line first: the Wealth/Encumbrance row, Magic and Faith, Traits and Corruption, Notes, and the Save/Delete row
  (from R2).
- The two near-identical career-options watchers (species and career list) in the 4e editor become one.

### R4 Modals on the native `<dialog>` (M)

`ModalWindow.vue` on `<dialog>` with `showModal()`: each modal owns its open state (`v-model:open` or an exposed
`open()`), so the global `useModal` store, the string ids, the `#modal` teleport target and the shade in `App.vue`
go. The browser then gives Escape to close, focus moved into the dialog and back, the rest of the page made inert,
and the top layer (no z-index juggling). A dialog's content stays mounted only while it is open, as now. The pickers'
`opened` and `resetPagination` counters are already redundant for that reason (the content is mounted afresh on
every open) and go; `DeleteModal`'s deep watcher and `nextTick` reset go with the string ids. Scroll lock
stays on `useScrollLock`.

### R5 Pickers (part of HG-15) (M–L)

HG-15 is about the look; the code side:

- Move `SelectIdNumberTable` (trappings in the item editor) and `CharacterModifierEffectTable` to
  `ChecklistPicker`, then delete `TableWithSearch.vue`.
- The pickers take `init*` props (`initSelectedItems`, `initSkills`, `initSources`…), copy them into local state and
  emit events that the parent applies to the model. Moving to `v-model` (or reading the model directly) removes the
  copies and the watchers that keep them in sync.

### R6 Buttons (S) — done 2026-10-15

`IconButton.vue` (icon only; the required `label` is its `aria-label` and tooltip; `to` makes it a link; `ghost` or
`light`, three sizes) replaces the ✕ remove buttons (10 components), the modal's close button and the list rows'
Copy and View. `ActionButton.vue`, `LinkButton.vue` and both `ActionButtons*` are gone: `CopyButton.vue` and
`CharacterRowActions.vue` replace them. The copied grey title band is `SheetTitle.vue`, used by `SheetTable`,
`EditControls`, `DeleteBlock`, `ChecklistPicker` and the item editor.

Differences from the plan:
- `EditControls` and `DeleteBlock` use `SheetTitle`, not `SectionCard`: `SectionCard` sets the sheet font and
  `min-w-fit`, which would change their text font and how they share a row.
- `AlertBlock` keeps its own close button, as its colours follow the alert type; it got an `aria-label`, and its
  classes now follow its props.
- Small visible changes: the ✕ buttons show a pointer cursor and a tooltip ("Remove …", "Close").

### R7 Move and rename (M, mechanical)

The layout above. Best done in one commit with no other change, after R1–R6 (so fewer files move) or before them
(so the rest happens in the new places); either works, but not mixed with logic changes.

## General improvements

- **`defineModel`**: 8 components still write `modelValue` + `emit("update:modelValue")` + a computed by hand
  (`FormInput`, `FormTextarea`, `SheetField`, `MultipleCheckboxColumnInput`, `SpellClassification`,
  `CharacterModifiersBlock`, `TablePagination`, `TableWithSearch`); 12 already use `defineModel`.
- **Props read once at setup**: `AlertBlock` builds its classes in refs from props at setup, `ModalWindow` its size,
  `TextLink` its colour, `HintModal` its id. They don't follow prop changes; use computed values or class maps (as
  `SheetTable` does).
- **Router**: `EditControls`, `DeleteBlock`, `MissingEditionVariant` and `UserResetPassword` import the router
  instance; use `useRouter()`.
- **Import alias**: 659 imports climb with `../../../`. An `@/` alias (Vite `resolve.alias` and `paths` in
  `tsconfig.json`) makes moves (R7) cheap and imports readable.
- **Route names and the "create" id**: route names are strings in 118 `routeName="…"` props and `"create"` appears
  96 times. A `RouteName` type (or vue-router's typed routes) catches typos at compile time; a `CREATE_ID` constant
  or an `isNew(id)` helper replaces the literal.
- **`any`**: ESLint's `no-explicit-any` is off. The few uses are easy to type (`params`/`query` in `TextLink` and
  `LinkButton` are `RouteParamsRaw`/`LocationQueryRaw`; `setFailureFromError(error: unknown)`); then turn the rule
  on. `composables/modal.ts` has an `as Element` that R4 removes.
- **Empty `<style scoped></style>`**: 110 files; remove them.
- **Content list cache** (optional): every character editor fetches eight content lists (up to sixteen for a 5e
  character with 4e content) and every visit to a list page fetches again. A per-session cache by type and edition,
  dropped on save, copy and delete, would cut most of these requests. Trade-off: content edited in another tab is
  not seen until reload.
- **Component tests** (optional): there are none. With `@vue/test-utils` a few shared components with logic
  (`FilterSidebar`, `BrowseList` search and paging, `EditControls` leave confirmation, `ChecklistPicker`) could be
  tested next to their files.

### Build and dependencies

- `package.json` lists everything under `dependencies`. Build and test tools (`vite`, `vitest`, `typescript`,
  `vue-tsc`, `eslint*`, `prettier`, `tailwindcss`, `@tailwindcss/vite`, `@vitejs/plugin-vue`, `@types/*`, `globals`)
  belong in `devDependencies`; CI runs `npm ci`, which installs both, so builds are unaffected.
- `@volar/language-server` and `@vue/language-server` are editor tools, and `autoprefixer` is not used by Tailwind
  v4 (no PostCSS config); all three can go.
- `vite.config.ts` `manualChunks` still looks for `CreateCharacter` (gone), so the character pages get no chunk of
  their own; and the paths change with R7. Either update the rules or drop `manualChunks` and let Vite split by
  route (the routes are already lazy).

### Docs

- `docs/architecture.md` still describes the colours as role scales (`primary`, `info`, `linked`…); `style.css`
  now has `neutral` plus named colours (`brand`, `parchment`, `editable`, `danger`, `alert-*`, visibility colours).
- It also lists `components/` as "shared components"; after R7 it should describe the folders and the rule.

## Decisions for the owner

1. **Where feature components live**: decided 2026-10-15: in `components/<feature>/`; `views/` stays route pages
   only.
2. **Names**: decided 2026-10-15: as proposed (`AppButton`/`ButtonLink`/`IconButton`, `SheetCard`/`SheetList`,
   `EditX` instead of `CreateX`, `Content` instead of `Warhammer` for the views folder).
3. **R3 scope**: decided 2026-10-15: share only the loading, alerts and the identical sections; no single editor
   with edition slots.
4. **R4**: decided 2026-10-15: native `<dialog>`, each modal with its own `v-model:open`; the modal store goes.
   Escape closing and proper focus handling are the intended visible changes.
5. **Optional items**: moved to `docs/issues.md` as HG-32 (content list cache) and HG-33 (component tests).
6. **Order**: proposed R6 → R4 → R1 → R2 → R3 → R5 → R7, with the general items in between, each checked with
   `vue-tsc`, `eslint`, `vitest` and a look at the affected pages.
