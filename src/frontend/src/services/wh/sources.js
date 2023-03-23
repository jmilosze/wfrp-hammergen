const sources = {
  0: "Custom",
  1: "WFRP",
  2: "Rough Nights & Hard Days",
};

export function displaySource(s) {
  return sources[s];
}

export function getAllSources() {
  const allSources = [];
  for (let [k, v] of Object.entries(sources)) {
    allSources.push({ source: k, name: v });
  }
  return allSources;
}
