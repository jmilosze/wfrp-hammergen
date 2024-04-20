import { LocationQueryRaw } from "vue-router";

export type SimpleQuery = Record<string, string>;

export function queryParamsFromRouterQuery(queryParams: SimpleQuery, routerQuery: LocationQueryRaw) {
  for (const key of Object.keys(queryParams)) {
    if (key in routerQuery) {
      queryParams[key] = String(routerQuery[key]);
    }
  }
}

export function queryParamsToRouterQuery(queryParams: SimpleQuery): LocationQueryRaw {
  const newQuery = {} as LocationQueryRaw;
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== "") {
      newQuery[key] = value;
    }
  }
  return newQuery;
}

export function getOptions<T extends number>(
  allOptions: T[],
  whOptions: T[],
  printFn: (x: T) => string,
  anyText: string,
): { text: string; value: string }[] {
  const setWhOptions = new Set(whOptions);
  const commonOptions = allOptions.filter((element) => setWhOptions.has(element));

  const options: { text: string; value: string }[] = [{ text: anyText, value: "" }];

  for (const option of commonOptions) {
    options.push({ text: printFn(option), value: option.toString() });
  }

  return options;
}
