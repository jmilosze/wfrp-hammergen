import { LocationQueryRaw } from "vue-router";

export type SimpleQuery = Record<string, string | number>;

export function queryParamsFromRouterQuery(queryParams: SimpleQuery, routerQuery: LocationQueryRaw) {
  for (const key of Object.keys(queryParams)) {
    if (key in routerQuery) {
      if (typeof queryParams[key] === "number") {
        queryParams[key] = Number(routerQuery[key]);
      } else {
        queryParams[key] = String(routerQuery[key]);
      }
    }
  }
}

export function queryParamsToRouterQuery(queryParams: SimpleQuery): LocationQueryRaw {
  const newQuery = {} as LocationQueryRaw;
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== "" && value !== -1) {
      newQuery[key] = value;
    }
  }
  return newQuery;
}
