export interface TableItem {
  id: string;
  [k: string]: StringOrNumber;
}
export type StringOrNumber = string | number;
export type TableField = { name: string; displayName: string };
