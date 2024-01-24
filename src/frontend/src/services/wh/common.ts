import { Source } from "./source.ts";

export interface WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  shared: boolean;
  source: Source;
  isEqualTo(otherWhProperty: WhProperty): boolean;
  copy(): WhProperty;
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

export function compareIdNumber(x: IdNumber, y: IdNumber): number {
  const xIdNumber = `${x.id}_${x.number}`;
  const yIdNumber = `${y.id}_${y.number}`;

  if (xIdNumber === yIdNumber) {
    return 0;
  } else {
    return xIdNumber < yIdNumber ? -1 : 1;
  }
}
