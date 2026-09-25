/**
 * Generic deep clone utility that preserves class prototypes, constructor types,
 * Maps, Sets, Dates, RegExps, Arrays, and nested objects.
 */
export function cloneEntity<T>(val: T): T {
  if (val === null || typeof val !== "object") {
    return val;
  }

  if (val instanceof Date) {
    return new Date(val.getTime()) as T;
  }

  if (val instanceof RegExp) {
    return new RegExp(val.source, val.flags) as T;
  }

  if (val instanceof Set) {
    const copy = new Set();
    for (const item of val) {
      copy.add(cloneEntity(item));
    }
    return copy as T;
  }

  if (val instanceof Map) {
    const copy = new Map();
    for (const [k, v] of val) {
      copy.set(cloneEntity(k), cloneEntity(v));
    }
    return copy as T;
  }

  if (Array.isArray(val)) {
    const copy: unknown[] = new Array(val.length);
    for (let i = 0; i < val.length; i++) {
      copy[i] = cloneEntity(val[i]);
    }
    return copy as T;
  }

  const proto = Object.getPrototypeOf(val);
  const copy = Object.create(proto) as Record<string, unknown>;
  const source = val as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    copy[key] = cloneEntity(source[key]);
  }

  return copy as T;
}
