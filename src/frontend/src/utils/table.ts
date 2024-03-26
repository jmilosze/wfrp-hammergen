export interface TableRow {
  id: string;
  name: string;
  [k: string]: TableItem;
}

export type TableItem = string | number | boolean;
export type TableField = { name: string; displayName: string };
