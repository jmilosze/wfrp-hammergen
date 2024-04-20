export function addSpaces(sentence: string | undefined, maxChars: number = 15): string {
  if (sentence === undefined) {
    return "";
  }

  const words: string[] = sentence.split(" ");
  const wordsWithSpaces: string[] = new Array(words.length);
  const re = new RegExp(`(.{${maxChars}})`, "g");
  for (const [idx, word] of words.entries()) {
    wordsWithSpaces[idx] = word.replace(re, "$1" + "\u200B");
  }
  return wordsWithSpaces.join(" ");
}

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
