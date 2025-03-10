export interface TableRow {
  id: string | number;
  name: string;
  [k: string]: TableItem;
}

export type TableItem = string | number | boolean;
export type TableField = { name: string; displayName: string; skipStackedTitle: boolean };
