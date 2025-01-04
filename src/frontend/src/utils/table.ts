import { Tooltip } from "./tooltip";

export interface TableRow {
  id: string | number;
  name: string;
  [k: string]: TableItem;
}

export type TableItem = string | number | boolean | Tooltip;
export type TableField = { name: string; displayName: string; skipStackedTitle: boolean };
