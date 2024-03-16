import {
  Attributes,
  attributesAreEqual,
  getAttributes,
  multiplyAttributes,
  sumAttributes,
  validAttributesFn,
} from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";

export interface CharacterModifiersData {
  size: number;
  movement: number;
  attributes: Attributes;
}

export class CharacterModifiers {
  size: number;
  movement: number;
  attributes: Attributes;

  constructor({ size = 0, movement = 0, attributes = getAttributes() } = {}) {
    this.size = size;
    this.movement = movement;
    this.attributes = attributes;
  }

  isNonZero(): boolean {
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
    return attributesAreEqual(this.attributes, otherCharacterModifiers.attributes);
  }

  copy(): CharacterModifiers {
    return new CharacterModifiers({
      size: this.size,
      movement: this.movement,
      attributes: JSON.parse(JSON.stringify(this.attributes)),
    });
  }

  add(...args: CharacterModifiers[] | CharacterModifiersData[]) {
    for (const characterModifiers of args) {
      this.size += characterModifiers.size;
      this.movement += characterModifiers.movement;
      this.attributes = sumAttributes(this.attributes, characterModifiers.attributes);
    }
    return this;
  }

  multiply(multiplier: number) {
    this.size *= multiplier;
    this.movement *= multiplier;
    this.attributes = multiplyAttributes(multiplier, this.attributes);

    return this;
  }

  validate(): ValidationStatus {
    return validAttributesFn(this.attributes, -99, 99);
  }
}
