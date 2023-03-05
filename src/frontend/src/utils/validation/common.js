export function checkString(testValue, label, regex, msg) {
  if (regex.test(testValue)) {
    return [true, null];
  }
  return [false, msg];
}
