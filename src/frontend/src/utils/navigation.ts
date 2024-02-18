import { hasValue } from "./other.ts";

export function addParamsToPath(path: string, params: Record<string, string>) {
  const encodedPairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (hasValue(value) && value !== "") {
      encodedPairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
    }
  }
  if (encodedPairs.length > 0) {
    history.pushState({}, "", path + "?" + encodedPairs.join("&"));
  } else {
    history.pushState({}, "", path);
  }
}
