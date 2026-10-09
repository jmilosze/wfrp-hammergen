import type { ApiResponse } from "./api.ts";

export type Edition = "4e" | "5e";

export const EDITIONS: Edition[] = ["4e", "5e"];

export function printEditionName(edition: Edition): string {
  return edition === "4e" ? "4th Edition" : "5th Edition";
}

// One model per edition variant of a content document.
export type Variants<T> = Partial<Record<Edition, T>>;

// variant returns the edition variant of a content document. Reads ask for an edition, so the API
// only returns documents that have it.
export function variant<WhApiData>(api: ApiResponse<WhApiData>, edition: Edition): WhApiData {
  const data = api.editions[edition];
  if (data === undefined) {
    throw new Error(`${api.id} has no ${edition} variant`);
  }
  return data;
}

// contentEdition returns the edition of a document's variant that applies to a character of edition e: its own
// edition, or 4e for 4e content without a 5e version on a 5e character that allows 4e content.
export function contentEdition<WhApiData>(api: ApiResponse<WhApiData>, e: Edition): Edition {
  return api.editions[e] !== undefined ? e : "4e";
}

// variantFor returns the variant of a document that applies to a character of edition e (see contentEdition).
export function variantFor<WhApiData>(api: ApiResponse<WhApiData>, e: Edition): WhApiData {
  return variant(api, contentEdition(api, e));
}

// with4eMark marks the name of 4e content on a 5e character.
export function with4eMark<WhApiData>(api: ApiResponse<WhApiData>, e: Edition, name: string): string {
  return contentEdition(api, e) === e ? name : `${name} (4e)`;
}

// Filter for pickers of a 5e character that allows 4e content: 4e entries are those whose id is in fourEIds.
export type EditionFilter = "both" | "5e" | "4e";

export function matchesEditionFilter(id: string, fourEIds: Set<string> | undefined, filter: EditionFilter): boolean {
  if (!fourEIds || filter === "both") {
    return true;
  }
  return fourEIds.has(id) === (filter === "4e");
}
