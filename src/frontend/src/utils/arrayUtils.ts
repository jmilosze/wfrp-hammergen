function defaultCompare<T>(x: T, y: T): -1 | 0 | 1 {
  if (x === y) {
    return 0;
  } else {
    return x < y ? -1 : 1;
  }
}

export function arraysAreEqualIgnoreOrder<T>(
  array1: T[],
  array2: T[],
  compareFunc: (x: T, y: T) => -1 | 0 | 1 = defaultCompare,
): boolean {
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
