export function objectsAreEqual<T extends object>(obj1: T, obj2: T) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const [key, val] of Object.entries(obj1)) {
    if (isKey(obj2, key)) {
      if (typeof val === "object") {
        if (!objectsAreEqual(obj2[key], val)) {
          return false;
        }
      } else {
        if (obj2[key] !== val) {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  return true;
}

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
