import { getAttributes, sumAndMultAttr } from "./attributes";

const checkModifiers = (modifiers) => {
  if (modifiers.size !== 0 || modifiers.movement !== 0) {
    return true;
  } else {
    for (let att of Object.values(modifiers.attributes)) {
      if (att !== 0) {
        return true;
      }
    }
  }
  return false;
};
const generateEmptyModifiers = () => {
  return {
    size: 0,
    movement: 0,
    attributes: getAttributes(),
  };
};

const compareModifiers = (mod1, mod2) => {
  for (let [key, value] of Object.entries(mod1)) {
    if (key !== "attributes") {
      if (mod2[key] !== value) {
        return false;
      }
    }
  }

  for (let [key, value] of Object.entries(mod1.attributes)) {
    if (value !== mod2.attributes[key]) {
      return false;
    }
  }
  return true;
};

const sumAndMultModifiers = (listOfMultAndModifiers) => {
  if (listOfMultAndModifiers.length === 0) {
    return generateEmptyModifiers();
  } else {
    return {
      size: listOfMultAndModifiers.reduce((a, v) => a + v.multiplier * v.modifiers.size, 0),
      movement: listOfMultAndModifiers.reduce((a, v) => a + v.multiplier * v.modifiers.movement, 0),
      attributes: sumAndMultAttr(
        listOfMultAndModifiers.map((x) => ({ multiplier: x.multiplier, attributes: x.modifiers.attributes }))
      ),
    };
  }
};

export { checkModifiers, generateEmptyModifiers, compareModifiers, sumAndMultModifiers };
