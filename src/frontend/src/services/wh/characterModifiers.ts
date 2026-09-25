import { Attributes, copyAttributes, getAttributes, validAttributesFn } from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { validIntegerFn } from "./common.ts";
import { cloneEntity } from "../../utils/clone.ts";
import { isEqualEntity } from "../../utils/equal.ts";

export const enum ModifierEffect {
  Hardy = 0,
}

export const modifierEffectList: ModifierEffect[] = [ModifierEffect.Hardy];

export function printEffectName(effect: ModifierEffect): string {
  switch (effect) {
    case ModifierEffect.Hardy:
      return "Hardy";
    default:
      return "";
  }
}

export function printEffectDesc(effect: ModifierEffect): string {
  switch (effect) {
    case ModifierEffect.Hardy:
      return "Increases Wounds by Toughness Bonus.";
    default:
      return "";
  }
}

export interface CharacterModifiersData {
  size: number;
  movement: number;
  attributes: Attributes;
  effects: number[];
}

export class CharacterModifiers {
  size: number;
  movement: number;
  attributes: Attributes;
  effects: Set<number>;

  constructor({ size = 0, movement = 0, attributes = getAttributes(), effects = [] as number[] } = {}) {
    this.size = size;
    this.movement = movement;
    this.attributes = attributes;
    this.effects = new Set(effects);
  }

  isNonZero(): boolean {
    if (this.size !== 0 || this.movement !== 0 || (this.effects && this.effects.size !== 0)) {
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

  isEqualTo(otherCharacterModifiers: unknown): boolean {
    return isEqualEntity(this, otherCharacterModifiers);
  }

  copy(): CharacterModifiers {
    return cloneEntity(this);
  }

  validateAttributes(): ValidationStatus {
    return validAttributesFn(this.attributes, -99, 99);
  }

  validateSize(): ValidationStatus {
    return validIntegerFn(this.size, -3, 3);
  }

  validateMovement(): ValidationStatus {
    return validIntegerFn(this.movement, -3, 3);
  }

  isValid(): boolean {
    return this.validateAttributes().valid && this.validateSize().valid && this.validateMovement().valid;
  }

  toData(): CharacterModifiersData {
    return {
      size: this.size,
      movement: this.movement,
      attributes: copyAttributes(this.attributes),
      effects: [...this.effects],
    };
  }

  updateEffects(id: number, selected: boolean) {
    if (!selected && this.effects.has(id)) {
      this.effects.delete(id);
    }
    if (selected) {
      this.effects.add(id);
    }
  }
}
