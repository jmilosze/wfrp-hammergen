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
