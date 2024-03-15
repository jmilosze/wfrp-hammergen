export function objectsAreEqual(obj1: any, obj2: any) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  for (const [key, val] of Object.entries(obj1)) {
    if (obj2[key] !== val) {
      return false;
    }
  }
  return true;
}

export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}
