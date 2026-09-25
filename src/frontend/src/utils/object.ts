export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}

export function clearObject(obj: object): void {
  for (const prop in obj) {
    if (isKey(obj, prop)) {
      delete obj[prop];
    }
  }
}
