export interface TableRow {
  id: string;
  name: string;
  canEdit: boolean;
  [k: string]: TableItem;
}

export type TableItem = string | number | boolean;
export type TableField = { name: string; displayName: string };
