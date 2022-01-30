import { skillAttributeTypesGroup } from "../skill";
import { ammunitionGroups, armorGroups, armorLocations, meleeGroups, meleeReach, rangedGroups } from "../item";
import { mutationTypes } from "../mutation";

function getWoundsFormula(speciesValue, T, WP, S) {
  const TB = Math.floor(T / 10);
  const WPB = Math.floor(WP / 10);
  const SB = Math.floor(S / 10);

  if (speciesValue === 1) {
    return 2 * TB + WPB;
  } else {
    return SB + 2 * TB + WPB;
  }
}

function getMovementFormula(speciesValue) {
  if (speciesValue === 1 || speciesValue === 2) {
    return 3;
  } else if (speciesValue === 0) {
    return 4;
  } else {
    return 5;
  }
}

function sortByName(x, y) {
  return x.name === y.name ? 0 : x.name < y.name ? -1 : 1;
}

function skillForDisplay(rawSkill, skillRank, attributes) {
  return {
    name: rawSkill.is_group ? `${rawSkill.name} (Any)` : rawSkill.name,
    attributeName: skillAttributeTypesGroup[rawSkill.attribute],
    attributeValue: attributes[skillAttributeTypesGroup[rawSkill.attribute]],
    advances: skillRank,
    skill: attributes[skillAttributeTypesGroup[rawSkill.attribute]] + skillRank,
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
      if (skillRank === 0 && !skill.display_zero) {
        continue;
      }

      // Do not display basic that do not depend on one attribute
      if (skillAttributeTypesGroup[skill.attribute] === "Various") {
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
      name: charItem.value.name,
      enc: charItem.value.enc,
      qualities: charItem.value.properties.map((x) => x.name),
      number: charItem.number,
      desc: charItem.value.description,
    };

    if (charItem.value.stats.type === 0) {
      item.group = meleeGroups[charItem.value.stats.group];
      item.rng = meleeReach[charItem.value.stats.reach];
      item.dmg = charItem.value.stats.dmg + charItem.value.stats.dmg_sb_mult * SB;
    } else if (charItem.value.stats.type === 1) {
      item.group = rangedGroups[charItem.value.stats.group];
      item.rng = charItem.value.stats.rng + charItem.value.stats.rng_sb_mult * SB;
      item.dmg = charItem.value.stats.dmg + charItem.value.stats.dmg_sb_mult * SB;
    } else if (charItem.value.stats.type === 2) {
      let range = charItem.value.stats.rng_mult !== 1 ? `Weapon x${charItem.value.stats.rng_mult}` : "Weapon";
      if (charItem.value.stats.rng > 0) {
        range += `+${parseInt(charItem.value.stats.rng)}`;
      } else if (charItem.value.stats.rng < 0) {
        range += `${parseInt(charItem.value.stats.rng)}`;
      }

      let damage = "Weapon";
      if (charItem.value.stats.dmg > 0) {
        damage += `+${parseInt(charItem.value.stats.dmg)}`;
      } else if (charItem.value.stats.rng < 0) {
        damage += `${parseInt(charItem.value.stats.dmg)}`;
      }

      item.group = ammunitionGroups[charItem.value.stats.group];
      item.rng = range;
      item.dmg = damage;
    } else if (charItem.value.stats.type === 3) {
      item.group = armorGroups[charItem.value.stats.group];
      item.locations = charItem.value.stats.location.map((x) => armorLocations[x]);
      item.ap = charItem.value.stats.points;
    } else {
      item.desc =
        (charItem.value.stats.type === 4 ? `(Capacity ${charItem.value.stats.capacity}) ` : "") +
        charItem.value.description;
    }
    items.push(item);
  }

  return items;
}

function formatSpells(rawSpells) {
  return rawSpells.map((x) => ({
    name: x.value.name,
    range: x.value.range,
    target: x.value.target,
    duration: x.value.duration,
    description: x.value.description,
    type: x.value.cn === -1 ? "Prayer" : "Spell",
    cn: x.value.cn === -1 ? null : x.value.cn,
  }));
}

function formatMutations(rawMutations) {
  return rawMutations.map((x) => {
    return {
      name: x.value.name,
      type: mutationTypes[x.value.type],
      description: x.value.description,
    };
  });
}

function getCareerName(career) {
  return `${career.value.name} ${career.level}`;
}

function getCareerLevelName(career) {
  const lvl = "level_" + career.level;
  return `${career.value[lvl].name}`;
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
