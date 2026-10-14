// A row of a BrowseList. meta: a short line after the name (e.g. the type); empty when there is none.
export type BrowseRow = {
  id: string;
  name: string;
  meta: string;
  description: string;
};
