export type ArrayWithId<T> = Array<{ id: string; value: T }>;
export type StringOrNumber = string | number;
export type TableItem = Record<string, StringOrNumber>;
export type TableField = { name: string; displayName: string };

export function getRows(fields: TableField[], items: TableItem[]): ArrayWithId<ArrayWithId<StringOrNumber>> {
  const rows: ArrayWithId<ArrayWithId<StringOrNumber>> = [];

  const [numberOfFields, fieldDict] = getFieldDict(fields);

  let rowId = 0;
  for (const item of items) {
    const newRow = {
      id: `${rowId}`,
      value: Array(numberOfFields) as ArrayWithId<StringOrNumber>,
    };

    let colId = 0;
    for (let i = 0; i < numberOfFields; i++) {
      newRow.value[i] = { id: `${rowId}${colId}`, value: "" };
      colId++;
    }

    for (const [name, value] of Object.entries(item)) {
      if (name in fieldDict) {
        newRow.value[fieldDict[name]].value = value;
      }
    }

    rows.push(newRow);
    rowId++;
  }
  return rows;
}

function getFieldDict(fields: TableField[]): [number, Record<string, number>] {
  let numberOfFields: number = 0;
  const fieldDict: Record<string, number> = {};

  for (const [fieldNumber, field] of fields.entries()) {
    fieldDict[field.name] = fieldNumber;
    numberOfFields++;
  }
  return [numberOfFields, fieldDict];
}
