import { skillAttributeTypesGroup } from "./skill";
import { ammunitionGroups, armorGroups, armorLocations, meleeGroups, meleeReach, rangedGroups } from "./item";
import { mutationTypes } from "./mutation";
import * as c from "./characterConstants";

const sizes = {
  tiny: 0,
  little: 1,
  small: 2,
  average: 3,
  large: 4,
  enormous: 5,
  monstrous: 6,
};

function getWoundsFormula(size, T, WP, S) {
  const TB = Math.floor(T / 10);
  const WPB = Math.floor(WP / 10);
  const SB = Math.floor(S / 10);

  if (size <= sizes.tiny) {
    return 1;
  } else if (size === sizes.little) {
    return TB;
  } else if (size === sizes.small) {
    return 2 * TB + WPB;
  } else if (size === sizes.average) {
    return SB + 2 * TB + WPB;
  } else if (size === sizes.large) {
    return (SB + 2 * TB + WPB) * 2;
  } else if (size === sizes.enormous) {
    return (SB + 2 * TB + WPB) * 4;
  } else {
    return (SB + 2 * TB + WPB) * 8;
  }
}

function getMovementFormula(speciesWithRegion) {
  if (
    c.HALFLING_LIST.includes(speciesWithRegion) ||
    c.DWARF_LIST.includes(speciesWithRegion) ||
    c.GNOME_LIST.includes(speciesWithRegion)
  ) {
    // Halfling, Dwarf, Gnome
    return 3;
  } else if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    // Human
    return 4;
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    // Ogre
    return 6;
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion) || c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    // Elves
    return 5;
  } else {
    return 0;
  }
}

function sortByName(x, y) {
  return x.name === y.name ? 0 : x.name < y.name ? -1 : 1;
}

function skillForDisplay(rawSkill, skillRank, attributes) {
  return {
    name: rawSkill.object.isGroup ? `${rawSkill.object.name} (Any)` : rawSkill.object.name,
    attributeName: skillAttributeTypesGroup[rawSkill.object.attribute],
    attributeValue: attributes[skillAttributeTypesGroup[rawSkill.object.attribute]],
    advances: skillRank,
    skill: attributes[skillAttributeTypesGroup[rawSkill.object.attribute]] + skillRank,
  };
}

function formatSkills(characterSkills, allSkills, attributes) {
  const basicSkills = [];
  const advancedSkills = [];

  for (const skill of allSkills) {
    if (skill.type === 0) {
      const characterSkill = characterSkills.find((x) => x.id === skill.id);
      const skillRank = characterSkill ? characterSkill.number : 0;

      // Do not display basic skills with rank 0 that do not have display_zero set to true
      if (skillRank === 0 && !skill.object.displayZero) {
        continue;
      }

      // Do not display basic that do not depend on one attribute
      if (skillAttributeTypesGroup[skill.object.attribute] === "Various") {
        continue;
      }

      basicSkills.push(skillForDisplay(skill, skillRank, attributes));
    } else {
      const characterSkill = characterSkills.find((x) => x.id === skill.id);
      if (!characterSkill) {
        continue;
      }
      advancedSkills.push(skillForDisplay(skill, characterSkill.number, attributes));
    }
  }

  return [basicSkills.sort(sortByName), advancedSkills.sort(sortByName)];
}

function formatItems(characterItems, attributes) {
  const SB = Math.floor(attributes.S / 10);
  const items = [];

  for (const charItem of characterItems) {
    const item = {
      name: charItem.wh.object.name,
      enc: charItem.wh.object.enc,
      qualities: charItem.wh.object.properties.map((x) => x.object.name),
      number: charItem.number,
      desc: charItem.wh.object.description,
    };

    if (charItem.wh.object.type === 0) {
      item.group = meleeGroups[charItem.wh.object.melee.group];
      item.rng = meleeReach[charItem.wh.object.melee.reach];
      item.dmg = charItem.wh.object.melee.dmg + charItem.wh.object.melee.dmgSbMult * SB;
    } else if (charItem.wh.object.type === 1) {
      item.group = rangedGroups[charItem.wh.object.ranged.group];
      item.rng = charItem.wh.object.ranged.rng + charItem.wh.object.ranged.rngSbMult * SB;
      item.dmg = charItem.wh.object.ranged.dmg + charItem.wh.object.ranged.dmgSbMult * SB;
    } else if (charItem.wh.object.type === 2) {
      let range =
        charItem.wh.object.ammunition.rngMult !== 1 ? `Weapon x${charItem.wh.object.ammunition.rngMult}` : "Weapon";
      if (charItem.wh.object.ammunition.rng > 0) {
        range += `+${parseInt(charItem.wh.object.ammunition.rng)}`;
      } else if (charItem.wh.object.ammunition.rng < 0) {
        range += `${parseInt(charItem.wh.object.ammunition.rng)}`;
      }

      let damage = "Weapon";
      if (charItem.wh.object.ammunition.dmg > 0) {
        damage += `+${parseInt(charItem.wh.object.ammunition.dmg)}`;
      } else if (charItem.wh.object.ammunition.rng < 0) {
        damage += `${parseInt(charItem.wh.object.ammunition.dmg)}`;
      }

      item.group = ammunitionGroups[charItem.wh.object.ammunition.group];
      item.rng = range;
      item.dmg = damage;
    } else if (charItem.wh.object.type === 3) {
      item.group = armorGroups[charItem.wh.object.armour.group];
      item.locations = charItem.wh.object.armour.location.map((x) => armorLocations[x]);
      item.ap = charItem.wh.object.armour.points;
    } else if (charItem.wh.object.type === 6) {
      item.spells = formatSpells(charItem.wh.object.grimoire.spells);
    } else {
      item.desc =
        (charItem.wh.object.type === 4 ? `(Capacity ${charItem.wh.object.container.capacity}) ` : "") +
        charItem.wh.object.description;
    }
    items.push(item);
  }

  return items;
}

function formatSpells(rawSpells) {
  return rawSpells.map((x) => ({
    name: x.object.name,
    range: x.object.range,
    target: x.object.target,
    duration: x.object.duration,
    description: x.object.description,
    type: x.object.cn === -1 ? "Prayer" : "Spell",
    cn: x.object.cn === -1 ? null : x.object.cn,
  }));
}

function formatMutations(rawMutations) {
  return rawMutations.map((x) => {
    return {
      name: x.object.name,
      type: mutationTypes[x.object.type],
      description: x.object.description,
    };
  });
}

function getCareerName(career) {
  return `${career.wh.object.name} ${career.number}`;
}

function getCareerLevelName(career) {
  const lvl = "level" + career.number;
  return `${career.wh.object[lvl].name}`;
}

function csvStr(stringValue) {
  return '"' + stringValue.replace(/"/g, '""') + '"';
}

export {
  getWoundsFormula,
  getMovementFormula,
  formatSkills,
  formatItems,
  formatSpells,
  formatMutations,
  getCareerName,
  getCareerLevelName,
  csvStr,
};
