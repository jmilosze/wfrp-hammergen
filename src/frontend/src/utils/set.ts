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
