// Character size steps.
export const enum Size {
  Tiny = 0,
  Little,
  Small,
  Average,
  Large,
  Enormous,
  Monstrous,
}

export function printSize(size: number): string {
  if (size <= Size.Tiny) {
    return "Tiny";
  } else if (size === Size.Little) {
    return "Little";
  } else if (size === Size.Small) {
    return "Small";
  } else if (size === Size.Average) {
    return "Average";
  } else if (size === Size.Large) {
    return "Large";
  } else if (size === Size.Enormous) {
    return "Enormous";
  } else {
    return "Monstrous";
  }
}

export const DEFAULT_SIZE = Size.Average;
