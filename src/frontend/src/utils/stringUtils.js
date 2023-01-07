export function addSpaces(sentence, maxChars) {
  let words = sentence.split(" ");
  let wordsWithSpaces = new Array(words.length);
  let re = new RegExp(`(.{${maxChars}})`, "g");
  for (let [idx, word] of words.entries()) {
    wordsWithSpaces[idx] = word.replace(re, "$1 ");
  }
  return wordsWithSpaces.join(" ");
}

export function addAnyToGroup(name, isGroup) {
  if (isGroup) {
    return name + " - Any";
  } else {
    return name;
  }
}
