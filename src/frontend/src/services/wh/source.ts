export type Source = Record<string, string>;

export function defaultSource(): Source {
  return { 0: "" };
}

export function copySource(source: Source) {
  return JSON.parse(JSON.stringify(source));
}
