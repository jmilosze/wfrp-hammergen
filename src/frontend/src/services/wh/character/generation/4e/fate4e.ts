// 4e Fate and Resilience: species values plus extra points.
import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "../../../core/species.ts";
import { rollDice, RollDiceFn } from "../../../../../utils/random.ts";
import { Character } from "../../character.ts";

export interface SpeciesFateResilience {
  fate: number;
  resilience: number;
  extra: number;
}

export const SPECIES_FATE_RESILIENCE: Record<string, SpeciesFateResilience> = {
  human: { fate: 2, resilience: 1, extra: 3 },
  halfling: { fate: 0, resilience: 2, extra: 3 },
  dwarf: { fate: 0, resilience: 2, extra: 2 },
  gnome: { fate: 2, resilience: 0, extra: 2 },
  ogre: { fate: 0, resilience: 3, extra: 1 },
  elf: { fate: 0, resilience: 0, extra: 2 },
  none: { fate: 0, resilience: 0, extra: 0 },
};

function getSpeciesFateResilience(species: SpeciesWithRegion): SpeciesFateResilience {
  if (HUMAN_LIST.includes(species)) {
    return SPECIES_FATE_RESILIENCE.human;
  } else if (HALFLING_LIST.includes(species)) {
    return SPECIES_FATE_RESILIENCE.halfling;
  } else if (DWARF_LIST.includes(species)) {
    return SPECIES_FATE_RESILIENCE.dwarf;
  } else if (GNOME_LIST.includes(species)) {
    return SPECIES_FATE_RESILIENCE.gnome;
  } else if (OGRE_LIST.includes(species)) {
    return SPECIES_FATE_RESILIENCE.ogre;
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    return SPECIES_FATE_RESILIENCE.elf;
  }
  return SPECIES_FATE_RESILIENCE.none;
}

export function generateFateAndResilience(species: SpeciesWithRegion, rollDiceFn: RollDiceFn): [number, number] {
  const base = getSpeciesFateResilience(species);
  let fate = base.fate;
  let resilience = base.resilience;

  for (let pt = 0; pt < base.extra; pt++) {
    const roll = rollDiceFn(2, 1);
    fate += roll % 2;
    resilience += Math.floor(roll / 2);
  }
  return [fate, resilience];
}

export function populateFateAndResilience(character: Character, rollDiceFn: RollDiceFn = rollDice): void {
  const [fate, resilience] = generateFateAndResilience(character.species, rollDiceFn);
  character.fate = fate;
  character.resilience = resilience;
  character.fortune = fate;
  character.resolve = resilience;
}
