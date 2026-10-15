import { Visibility } from "../../../services/wh/core/entity.ts";

// A row of a BrowseList. meta: a short line after the name (e.g. the type); empty when there is none. ownerId and
// visibility give the visibility icon after it.
export type BrowseRow = {
  id: string;
  name: string;
  meta: string;
  description: string;
  ownerId: string;
  visibility: Visibility;
};
