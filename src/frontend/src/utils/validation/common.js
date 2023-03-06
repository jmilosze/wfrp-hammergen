export function checkString(testValue, regex, msg) {
  if (regex.test(testValue)) {
    return [true, null];
  }
  return [false, msg];
}
