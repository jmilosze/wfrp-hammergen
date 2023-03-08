export function checkString(testValue, regex, msg) {
  if (regex.test(testValue)) {
    return [true, null];
  }
  return [false, msg];
}

export function checkFloat(testValue, minValue, maxValue, msg) {
  if (testValue >= minValue && testValue <= maxValue) {
    return [true, null];
  }
  return [false, msg];
}
