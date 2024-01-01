export interface Wh {
  id: string;
  canEdit: boolean;
}

export interface WhApiResponse<WhApiData> {
  id: string;
  canEdit: boolean;
  ownerId: string;
  object: WhApiData;
}

export type WhSource = Record<string, string>;

export function defaultSource(): WhSource {
  return { 0: "" };
}
export function compareWhSources(whSource1: WhSource, whSource2: WhSource) {
  if (Object.keys(whSource1).length != Object.keys(whSource2).length) {
    return false;
  }

  for (const [key, val] of Object.entries(whSource1)) {
    if (whSource2[key] != val) {
      return false;
    }
  }
  return true;
}
