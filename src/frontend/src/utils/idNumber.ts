export interface IdNumber {
  id: string;
  number: number;
}

export function compareIdNumber(x: IdNumber, y: IdNumber): -1 | 0 | 1 {
  if (x.id !== y.id) {
    return x.id < y.id ? -1 : 1;
  }
  if (x.number === y.number) {
    return 0;
  }
  return x.number < y.number ? -1 : 1;
}

export function idNumberArrayToRecord(arr: IdNumber[]): Record<string, number> {
  return arr.reduce(
    (acc, current) => {
      acc[current.id] = current.number;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function copyIdNumberArray(arr: IdNumber[]): IdNumber[] {
  if (arr) {
    const retArr = new Array<IdNumber>(arr.length);
    for (const [i, item] of arr.entries()) {
      retArr[i] = { id: item.id, number: item.number };
    }
    return retArr;
  } else {
    return [] as IdNumber[];
  }
}

export function updateIdNumberRecord(idNumberRecord: Record<string, number>, item: IdNumber): void {
  if (item.number === 0) {
    if (item.id in idNumberRecord) {
      delete idNumberRecord[item.id];
    }
    return;
  }

  idNumberRecord[item.id] = item.number;
}

export function fillUpIdNumberRecord(idNumberRecord: Record<string, number>, newVals: Record<string, number>): void {
  for (const [id, number] of Object.entries(newVals)) {
    if (id in idNumberRecord) {
      if (idNumberRecord[id] < number) {
        idNumberRecord[id] = number;
      }
    } else {
      idNumberRecord[id] = number;
    }
  }
}
