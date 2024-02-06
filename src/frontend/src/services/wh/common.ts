import { Source } from "./source.ts";

export interface WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  shared: boolean;
  source: Source;
}

export interface WhApi<T, TApiData> {
  getElement: (id: string) => Promise<T>;
  listElements: (id: string) => Promise<T[]>;
  createElement: (wh: T) => Promise<ApiResponse<TApiData>>;
  updateElement: (wh: T) => Promise<ApiResponse<TApiData>>;
  deleteElement: (id: string) => Promise<void>;
}

export interface ApiResponse<WhApiData> {
  id: string;
  canEdit: boolean;
  ownerId: string;
  object: WhApiData;
}

export interface IdNumber {
  id: string;
  number: number;
}

export function compareIdNumber(x: IdNumber, y: IdNumber): -1 | 0 | 1 {
  const xIdNumber = `${x.id}_${x.number}`;
  const yIdNumber = `${y.id}_${y.number}`;

  if (xIdNumber === yIdNumber) {
    return 0;
  } else {
    return xIdNumber < yIdNumber ? -1 : 1;
  }
}
