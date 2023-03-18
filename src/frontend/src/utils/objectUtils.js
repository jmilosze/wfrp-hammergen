const invertObj = (obj) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

function compareObjects(obj1, obj2) {
  let testVal;
  if (obj1.size !== obj2.size) {
    return false;
  }
  for (let [key, val] of Object.entries(obj1)) {
    testVal = obj2[key];
    // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives
    if (testVal !== val || (testVal === undefined && !(key in obj2))) {
      return false;
    }
  }
  return true;
}

export { invertObj, compareObjects };
