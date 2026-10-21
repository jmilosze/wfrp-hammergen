// An item of a ChecklistPicker.
// repeatable: picked any number of times (e.g. a creature trait with a value), with Add instead of a checkbox; count is
// how many times it is picked. number: picked with a number (e.g. skill advances) typed in instead of ticked; 0 is not
// picked. note: a short line under the description (e.g. a skill's type and characteristic). choices: several labelled
// checkboxes at the row's end instead of one (e.g. a career level's Current and Past). linkId: the id of the item's page
// when it differs from id (e.g. the career of a career level).
export type ChecklistChoice = { key: string; label: string; checked: boolean; disabled?: boolean };
export type ChecklistItem = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  repeatable?: boolean;
  count?: number;
  number?: number;
  note?: string;
  choices?: ChecklistChoice[];
  linkId?: string;
};
