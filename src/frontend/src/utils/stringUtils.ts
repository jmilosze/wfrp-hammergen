export function addSpaces(sentence: string, maxChars: number): string {
  const words: string[] = sentence.split(" ");
  const wordsWithSpaces: string[] = new Array(words.length);
  const re = new RegExp(`(.{${maxChars}})`, "g");
  for (const [idx, word] of words.entries()) {
    wordsWithSpaces[idx] = word.replace(re, "$1 ");
  }
  return wordsWithSpaces.join(" ");
}

export function addAnyToGroup(name: string, isGroup: boolean): string {
  if (isGroup) {
    return name + " - Any";
  } else {
    return name;
  }
}
