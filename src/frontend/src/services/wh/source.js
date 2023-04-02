const source = {
  0: "Custom",
  1: "WFRP",
  2: "Rough Nights & Hard Days",
  3: "Archives Volume I",
  4: "Archives Volume II",
  5: "Archives Volume III",
  6: "Up in Arms",
  7: "Winds of Magic",
};

export function getAllSources() {
  const allSources = [];
  for (let [k, v] of Object.entries(source)) {
    allSources.push({ source: k, name: v });
  }
  return allSources;
}

export function defaultSource() {
  return { 0: "" };
}
