export function truncate(sentence: string | undefined, charNumber: number | undefined): string {
  if (sentence === undefined) {
    return "";
  }

  if (charNumber === undefined) {
    return sentence;
  }

  return sentence.length > charNumber ? sentence.substring(0, charNumber) + "..." : sentence;
}

export function addAnyToGroup(name: string, isGroup: boolean): string {
  if (isGroup) {
    return name + " - Any";
  } else {
    return name;
  }
}
