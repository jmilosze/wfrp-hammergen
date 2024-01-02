import { Attributes, getAttributes, multiplyAttributes, sumAttributes } from "./attributes";

export class CharacterModifiers {
  size: number;
  movement: number;
  attributes: Attributes;

  constructor(
    modifiers: { size: number; movement: number; attributes: Attributes } = {
      size: 0,
      movement: 0,
      attributes: getAttributes(),
    },
  ) {
    this.size = modifiers.size;
    this.movement = modifiers.movement;
    this.attributes = modifiers.attributes;
  }

  checkModifiers(): boolean {
    if (this.size !== 0 || this.movement !== 0) {
      return true;
    } else {
      for (const att of Object.values(this.attributes)) {
        if (att !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  isEqualTo(otherCharacterModifiers: CharacterModifiers) {
    if (this.size !== otherCharacterModifiers.size || this.movement !== otherCharacterModifiers.movement) {
      return false;
    }
    for (const key of Object.keys(this.attributes)) {
      if (this.attributes[key] !== otherCharacterModifiers.attributes[key]) {
        return false;
      }
    }
    return true;
  }

  add(otherCharacterModifiers: CharacterModifiers) {
    this.size += otherCharacterModifiers.size;
    this.movement += otherCharacterModifiers.movement;
    this.attributes = sumAttributes(this.attributes, otherCharacterModifiers.attributes);

    return this;
  }

  multiply(multiplier: number) {
    this.size *= multiplier;
    this.movement *= multiplier;
    this.attributes = multiplyAttributes(multiplier, this.attributes);

    return this;
  }
}
