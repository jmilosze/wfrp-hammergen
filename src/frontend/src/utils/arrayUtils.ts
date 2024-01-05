function defaultCompare<T>(x: T, y: T): number {
  if (x === y) {
    return 0;
  } else {
    return x < y ? -1 : 1;
  }
}

export function compareIdNumber(x: { id: string; number: number }, y: { id: string; number: number }): number {
  const xIdNumber = `${x.id}_${x.number}`;
  const yIdNumber = `${y.id}_${y.number}`;

  if (xIdNumber === yIdNumber) {
    return 0;
  } else {
    return xIdNumber < yIdNumber ? -1 : 1;
  }
}

export function arraysAreEqualIgnoreOrder<T>(array1: T[], array2: T[], compareFunc = defaultCompare) {
  if (array1.length !== array2.length) {
    return false;
  }

  const sortedArray1 = array1.concat().sort(compareFunc);
  const sortedArray2 = array2.concat().sort(compareFunc);

  for (let i = 0; i < sortedArray1.length; ++i) {
    if (compareFunc(sortedArray1[i], sortedArray2[i]) !== 0) {
      return false;
    }
  }
  return true;
}
