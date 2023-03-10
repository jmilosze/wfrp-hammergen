export function compareBoolFn(att, compareNext = () => 0) {
  return function (a, b) {
    return a[att] === b[att] ? compareNext(a, b) : a[att] ? -1 : 1;
  };
}

export function compareNumberFn(att, compareNext = () => 0) {
  return function (a, b) {
    const aNonZero = a[att] !== 0;
    const bNonZero = b[att] !== 0;
    return aNonZero === bNonZero ? compareNext(a, b) : aNonZero ? -1 : 1;
  };
}

export function compareStringFn(att) {
  return function (a, b) {
    return a[att].localeCompare(b[att]);
  };
}

export function compareAnyBoolFn(attList, compareNext = () => 0) {
  return function (a, b) {
    let aAny = false;
    for (const att of attList) {
      aAny |= a[att];
      if (aAny) {
        break;
      }
    }

    let bAny = false;
    for (const att of attList) {
      bAny |= b[att];
      if (bAny) {
        break;
      }
    }

    return aAny === bAny ? compareNext(a, b) : aAny ? -1 : 1;
  };
}
