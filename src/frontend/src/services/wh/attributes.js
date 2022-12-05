const racialAttributes = {
  none: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  human: { WS: 20, BS: 20, S: 20, T: 20, I: 20, Ag: 20, Dex: 20, Int: 20, WP: 20, Fel: 20 },
  halfling: { WS: 10, BS: 30, S: 10, T: 20, I: 20, Ag: 20, Dex: 30, Int: 20, WP: 30, Fel: 30 },
  dwarf: { WS: 30, BS: 20, S: 20, T: 30, I: 20, Ag: 10, Dex: 30, Int: 20, WP: 40, Fel: 10 },
  elf: { WS: 30, BS: 30, S: 20, T: 20, I: 40, Ag: 30, Dex: 30, Int: 30, WP: 30, Fel: 20 },
  gnome: { WS: 20, BS: 10, S: 10, T: 15, I: 30, Ag: 30, Dex: 30, Int: 30, WP: 40, Fel: 15 },
};

const attributes = {
  1: "WS",
  2: "BS",
  3: "S",
  4: "T",
  5: "I",
  6: "Ag",
  7: "Dex",
  8: "Int",
  9: "WP",
  10: "Fel",
};

const getAttributes = (species = -1) => {
  if (species === 0) {
    return JSON.parse(JSON.stringify(racialAttributes.human));
  } else if (species === 1) {
    return JSON.parse(JSON.stringify(racialAttributes.halfling));
  } else if (species === 2) {
    return JSON.parse(JSON.stringify(racialAttributes.dwarf));
  } else if (species === 3 || species === 4) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (species === 5) {
    return JSON.parse(JSON.stringify(racialAttributes.gnome));
  } else {
    return JSON.parse(JSON.stringify(racialAttributes.none));
  }
};

function sumAndMultAttr(listOfAttrAndMultipliers) {
  let returnAttr = JSON.parse(JSON.stringify(racialAttributes.none));
  for (let attrName of Object.keys(returnAttr)) {
    for (let attAndMultiplier of listOfAttrAndMultipliers) {
      returnAttr[attrName] += attAndMultiplier["multiplier"] * attAndMultiplier["attributes"][attrName];
    }
  }
  return returnAttr;
}

export { racialAttributes, attributes, getAttributes, sumAndMultAttr };
