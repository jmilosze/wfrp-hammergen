export const source = {
  0: "Custom",
  1: "WFRP",
  2: "Rough Nights & Hard Days",
  3: "Archives Volume I",
  4: "Archives Volume II",
  5: "Archives Volume III",
  6: "Up in Arms",
  7: "Winds of Magic",
  8: "Middenheim",
  9: "Salzenmund",
  10: "Sea of Claws",
  11: "Lustria",
  12: "Enemy in Shadows Companion",
  13: "Death on the Reik Companion",
  14: "Enemy in Shadows",
  15: "Death on the Reik",
};

export function sourceOptions() {
  const options = [];
  for (let [k, v] of Object.entries(source)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
}

export function defaultSource() {
  return { 0: "" };
}
