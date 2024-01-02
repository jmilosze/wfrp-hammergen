export type Source = Record<string, string>;

export function defaultSource(): Source {
  return { 0: "" };
}

export function sourcesAreEqual(source1: Source, source2: Source) {
  if (Object.keys(source1).length !== Object.keys(source2).length) {
    return false;
  }

  for (const [key, val] of Object.entries(source1)) {
    if (source2[key] !== val) {
      return false;
    }
  }
  return true;
}

export function copySource(source: Source) {
  return JSON.parse(JSON.stringify(source));
}
