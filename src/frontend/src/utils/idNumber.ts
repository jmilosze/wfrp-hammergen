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

export function idNumberArrayToRecord(arr: IdNumber[]): Record<string, number> {
  return arr.reduce(
    (acc, current) => {
      acc[current.id] = current.number;
      return acc;
    },
    {} as Record<string, number>,
  );
}
