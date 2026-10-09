// CSV helpers shared by the 4e and 5e exports.
export function csvStr(stringValue: string | undefined): string {
  if (typeof stringValue === "undefined") {
    return "";
  } else {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
}
