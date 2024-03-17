export function setsAreEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
  if (setA.size !== setB.size) return false;

  for (const element of setA) {
    if (!setB.has(element)) {
      return false;
    }
  }

  return true;
}
