import { Attributes, copyAttributes, validAttributesFn, zeroAttributes } from "./attributes.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { Edition, validIntegerFn } from "./common.ts";
import { cloneEntity } from "../../utils/clone.ts";
import { isEqualEntity } from "../../utils/equal.ts";

export const enum ModifierEffect {
  Hardy = 0,
  StrongBack = 1,
  Sturdy = 2,
}

// Effects used by each edition's rules.
export const modifierEffectsByEdition: Record<Edition, ModifierEffect[]> = {
  "4e": [ModifierEffect.Hardy],
  "5e": [ModifierEffect.Hardy, ModifierEffect.StrongBack, ModifierEffect.Sturdy],
};

// effectsForEdition keeps only the effects used by the edition's rules.
export function effectsForEdition(effects: Set<number>, edition: Edition): Set<number> {
  return new Set([...effects].filter((e) => modifierEffectsByEdition[edition].includes(e)));
}

export function printEffectName(effect: ModifierEffect): string {
  switch (effect) {
    case ModifierEffect.Hardy:
      return "Hardy";
    case ModifierEffect.StrongBack:
      return "Strong Back";
    case ModifierEffect.Sturdy:
      return "Sturdy";
    default:
      return "";
  }
}

export function printEffectDesc(effect: ModifierEffect): string {
  switch (effect) {
    case ModifierEffect.Hardy:
      return "Increases Wounds by Toughness Bonus.";
    case ModifierEffect.StrongBack:
      return "Increases the Encumbrance limit by 1, or by 3 when taken twice.";
    case ModifierEffect.Sturdy:
      return "Counts Strength Bonus twice for the Encumbrance limit.";
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

  constructor({ size = 0, movement = 0, attributes = zeroAttributes(), effects = [] as number[] } = {}) {
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
