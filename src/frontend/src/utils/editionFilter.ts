// Filter for pickers of a 5e character that allows 4e content: 4e entries are those whose id is in fourEIds.
export type EditionFilter = "both" | "5e" | "4e";

export function matchesEditionFilter(id: string, fourEIds: Set<string> | undefined, filter: EditionFilter): boolean {
  if (!fourEIds || filter === "both") {
    return true;
  }
  return fourEIds.has(id) === (filter === "4e");
}
