export interface EqualOptions {
  unorderedKeys?: ReadonlySet<string>;
  ignoredKeys?: ReadonlySet<string>;
  unorderedArrays?: boolean;
}

export const DEFAULT_UNORDERED_KEYS: ReadonlySet<string> = new Set([
  "species",
  "attributes",
  "location",
  "careerPath",
  "applicableTo",
  "labels",
  "sharedAccounts",
]);

/**
 * Domain-aware deep equality comparator that handles primitives, Dates, RegExps,
 * Sets, Maps, prototype identity, unordered domain arrays, and ignored properties.
 */
export function isEqualEntity(a: unknown, b: unknown, options?: EqualOptions): boolean {
  return isEqualInternal(a, b, options, undefined);
}

function isEqualInternal(a: unknown, b: unknown, options?: EqualOptions, currentKey?: string): boolean {
  if (a === b) {
    return true;
  }

  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    if (typeof a === "number" && typeof b === "number" && Number.isNaN(a) && Number.isNaN(b)) {
      return true;
    }
    return false;
  }

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) {
      return false;
    }
    for (const itemA of a) {
      if (b.has(itemA)) {
        continue;
      }
      let found = false;
      for (const itemB of b) {
        if (isEqualInternal(itemA, itemB, options, undefined)) {
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    return true;
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }
    for (const [keyA, valA] of a) {
      if (!b.has(keyA)) {
        return false;
      }
      if (!isEqualInternal(valA, b.get(keyA), options, undefined)) {
        return false;
      }
    }
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    const unorderedKeys = options?.unorderedKeys ?? DEFAULT_UNORDERED_KEYS;
    const isUnordered = options?.unorderedArrays || (currentKey !== undefined && unorderedKeys.has(currentKey));

    if (isUnordered) {
      if (a.length === 0) {
        return true;
      }
      const matchedIndices = new Set<number>();
      for (const itemA of a) {
        let found = false;
        for (let j = 0; j < b.length; j++) {
          if (matchedIndices.has(j)) {
            continue;
          }
          if (isEqualInternal(itemA, b[j], options, undefined)) {
            matchedIndices.add(j);
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    } else {
      for (let i = 0; i < a.length; i++) {
        if (!isEqualInternal(a[i], b[i], options, undefined)) {
          return false;
        }
      }
      return true;
    }
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const ignoredKeys = options?.ignoredKeys;

  const keysA = Object.keys(objA).filter((k) => !ignoredKeys?.has(k));
  const keysB = Object.keys(objB).filter((k) => !ignoredKeys?.has(k));

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
    if (!isEqualInternal(objA[key], objB[key], options, key)) {
      return false;
    }
  }

  return true;
}
