export function setsAreEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
  if (setA.size !== setB.size) return false;

  for (const element of setA) {
    if (!setB.has(element)) {
      return false;
    }
  }

  return true;
}

export function updateSet(set: Set<string>, item: string, selected: boolean) {
  if (selected) {
    if (set.has(item)) {
      // do nothing
      return;
    } else {
      set.add(item);
    }
  } else {
    if (set.has(item)) {
      set.delete(item);
      return;
    } else {
      // do nothing
    }
  }
}
