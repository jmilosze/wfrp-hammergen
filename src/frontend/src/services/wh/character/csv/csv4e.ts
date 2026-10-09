// CSV export of a 4e character (the 5e export is in csv5e.ts).
import { CharacterFull } from "../characterFull.ts";
import { csvStr } from "./csv.ts";

export function characterFullToCsv4e(characterFull: CharacterFull): string {
  let csv = "Name,Species,Career,Class,Status,,,,,,\n";
  csv += csvStr(characterFull.name) + ",";
  csv += csvStr(characterFull.species) + ",";
  const career = characterFull.currentCareer;
  csv += (career ? csvStr(`${career.name} (${career.levelName})`) : "") + ",";
  csv += (career ? csvStr(career.className) : "") + ",";
  csv += csvStr(characterFull.status + " " + characterFull.standing) + ",";
  csv += ",,,,,\n";

  csv += "Past Careers,";
  csv += csvStr(characterFull.pastCareers.map((x) => x.name).join(", ")) + ",";
  csv += ",,,,,,,,\n";
  csv += "Description,";
  csv += csvStr(characterFull.description) + ",";
  csv += ",,,,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Notes,,,,,,,,,,\n";
  csv += csvStr(characterFull.notes) + ",,,,,,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Movement,,,Wealth,,,Fate And Resilience,,,,\n";
  csv += "Movement,Walk,Run,D,SS,GC,Fate,Fortune,Resilience,Resolve,\n";

  csv += characterFull.movement + "," + characterFull.walk + "," + characterFull.run + ",";
  csv += characterFull.brass + "," + characterFull.silver + "," + characterFull.gold + ",";
  csv +=
    characterFull.fate +
    "," +
    characterFull.fortune +
    "," +
    characterFull.resilience +
    "," +
    characterFull.resolve +
    ",\n";

  csv += ",,,,,,,,,,\n";
  csv += "Wounds,Sin Points,Corruption Points,Current XP,Spent XP,Total XP,,,,,\n";
  csv += characterFull.wounds + "," + characterFull.sin + "," + characterFull.corruption + ",";
  csv += characterFull.currentExp + "," + characterFull.spentExp + "," + characterFull.totalExp + ",";
  csv += ",,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Attributes,,,,,,,,,,\n";
  csv += ",WS,BS,S,T,I,Ag,Dex,Int,Wp,Fel\n";
  csv += "Base" + "," + characterFull.baseAttributes.WS + "," + characterFull.baseAttributes.BS + ",";
  csv += characterFull.baseAttributes.S + "," + characterFull.baseAttributes.T + ",";
  csv += characterFull.baseAttributes.I + "," + characterFull.baseAttributes.Ag + ",";
  csv += characterFull.baseAttributes.Dex + "," + characterFull.baseAttributes.Int + ",";
  csv += characterFull.baseAttributes.WP + "," + characterFull.baseAttributes.Fel + "\n";

  csv += "Other" + "," + characterFull.otherAttributes.WS + "," + characterFull.otherAttributes.BS + ",";
  csv += characterFull.otherAttributes.S + "," + characterFull.otherAttributes.T + ",";
  csv += characterFull.otherAttributes.I + "," + characterFull.otherAttributes.Ag + ",";
  csv += characterFull.otherAttributes.Dex + "," + characterFull.otherAttributes.Int + ",";
  csv += characterFull.otherAttributes.WP + "," + characterFull.otherAttributes.Fel + "\n";

  csv += "Advances" + "," + characterFull.attributeAdvances.WS + "," + characterFull.attributeAdvances.BS + ",";
  csv += characterFull.attributeAdvances.S + "," + characterFull.attributeAdvances.T + ",";
  csv += characterFull.attributeAdvances.I + "," + characterFull.attributeAdvances.Ag + ",";
  csv += characterFull.attributeAdvances.Dex + "," + characterFull.attributeAdvances.Int + ",";
  csv += characterFull.attributeAdvances.WP + "," + characterFull.attributeAdvances.Fel + "\n";

  csv += "Total" + "," + characterFull.attributes.WS + "," + characterFull.attributes.BS + ",";
  csv += characterFull.attributes.S + "," + characterFull.attributes.T + ",";
  csv += characterFull.attributes.I + "," + characterFull.attributes.Ag + ",";
  csv += characterFull.attributes.Dex + "," + characterFull.attributes.Int + ",";
  csv += characterFull.attributes.WP + "," + characterFull.attributes.Fel + "\n";

  csv += ",,,,,,,,,,\n";
  csv += "Basic Skills,,,,,,,,,,\n";
  csv += "Name,Attr,Attr Val,Adv,Skill,Name,Attr,Attr Val,Adv,Skill,\n";

  const basicSkills1 = characterFull.basicSkills.slice(0, Math.floor(characterFull.basicSkills.length / 2));
  const basicSkills2 = characterFull.basicSkills.slice(Math.floor(characterFull.basicSkills.length / 2));

  for (let i = 0; i < basicSkills2.length; ++i) {
    const s1 = basicSkills1[i];
    const s2 = basicSkills2[i];

    if (s1) {
      csv += csvStr(s1.name) + "," + s1.attributeName + ",";
      csv += s1.attributeValue + "," + s1.advances + ", " + s1.skill + ",";
    } else {
      csv += ",,,,,";
    }

    csv += csvStr(s2.name) + "," + s2.attributeName + ",";
    csv += s2.attributeValue + "," + s2.advances + ", " + s2.skill + ",\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Advanced Skills,,,,,Talents,,,,,\n";
  csv += "Name,Attr,Attr Val,Adv,Skill,Name,Times Taken,,,,\n";

  for (let i = 0; i < Math.max(characterFull.advancedSkills.length, characterFull.talents.length); ++i) {
    const s1 = characterFull.advancedSkills[i];
    const s2 = characterFull.talents[i];

    if (s1) {
      csv += csvStr(s1.name) + "," + s1.attributeName + ",";
      csv += s1.attributeValue + "," + s1.advances + "," + s1.skill + ",";
    } else {
      csv += ",,,,,";
    }

    if (s2) {
      csv += csvStr(s2.name) + "," + s2.rank + ",,,,\n";
    } else {
      csv += ",,,,,\n";
    }
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Armor,,,,,,,,,,\n";
  csv += "Name,Group,Locations,Enc,AP,Qualities,Runes,Number,,,\n";

  for (const armour of characterFull.equippedArmor) {
    csv += csvStr(armour.name) + "," + csvStr(armour.group) + ",";
    csv += csvStr(armour.locations?.join(", ")) + "," + armour.enc + ",";
    csv +=
      armour.ap +
      "," +
      csvStr(armour.qualitiesFlaws.map((x) => x.name).join(", ")) +
      "," +
      csvStr(armour.runes.map((x) => x.name + `(x${x.number})`).join(", ")) +
      "," +
      armour.number +
      ",,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Weapons,,,,,,,,,,\n";
  csv += "Name,Group,Enc,Range/Reach,Damage,Qualities,Runes,Number,,,\n";

  for (const weapon of characterFull.equippedWeapon) {
    csv += csvStr(weapon.name) + "," + weapon.group + "," + weapon.enc + "," + weapon.rng + ",";
    csv +=
      weapon.dmg +
      "," +
      csvStr(weapon.qualitiesFlaws.map((x) => x.name).join(", ")) +
      "," +
      csvStr(weapon.runes.map((x) => x.name + `(x${x.number})`).join(", ")) +
      "," +
      weapon.number +
      ",,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Other Equipped,,,,,,,,,,\n";
  csv += "Name,Enc,Number,Description,,,,,,,\n";

  for (const item of characterFull.equippedOther) {
    csv += csvStr(item.name) + "," + item.enc + "," + item.number + "," + csvStr(item.description) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Carried,,,,,,,,,,\n";
  csv += "Name,Enc,Number,Description,,,,,,,\n";

  for (const item of characterFull.carried) {
    csv += csvStr(item.name) + "," + item.enc + "," + item.number + "," + csvStr(item.description) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Encumbrance,,,,,,,,,,\n";
  csv += "Armor,Weapon,Other,Carried,,,,,,,\n";
  csv +=
    characterFull.encArmor +
    "," +
    characterFull.encWeapon +
    "," +
    characterFull.encOther +
    "," +
    characterFull.encCarried +
    ",";
  csv += ",,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Stored,,,,,,,,,,\n";
  csv += "Name,Number,Description,,,,,,,\n";
  for (const item of characterFull.stored) {
    csv += csvStr(item.name) + "," + item.number + "," + csvStr(item.description) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Mutations,,,,,,,,,,\n";
  csv += "Name,Type,Description,,,,,,,,\n";

  for (const item of characterFull.mutations) {
    csv += csvStr(item.name) + "," + item.type + "," + csvStr(item.description) + ",,,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Traits,,,,,,,,,,\n";
  csv += "Name,Description,,,,,,,,,\n";

  for (const item of characterFull.traits) {
    csv += csvStr(item.name) + "," + csvStr(item.description) + ",,,,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Known Spells,,,,,,,,,,\n";
  csv += "Name,CN,Range,Target,Duration,,,,,,\n";

  for (const item of characterFull.spells) {
    csv += csvStr(item.name) + "," + item.cn + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Known Prayers,,,,,,,,,,\n";
  csv += "Name,Range,Target,Duration,,,,,,\n";

  for (const item of characterFull.prayers) {
    csv += csvStr(item.name) + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Spells in Grimoires,,,,,,,,,,\n";
  for (const item of [...characterFull.carried, ...characterFull.stored]) {
    if (item.spells) {
      csv += csvStr(item.name) + ",,,,,,,,,\n";
      csv += "Name,CN,Range,Target,Duration,,,,,,\n";
      for (const spell of item.spells) {
        csv += csvStr(spell.name) + "," + spell.cn + "," + csvStr(spell.range) + ",";
        csv += csvStr(spell.target) + "," + csvStr(spell.duration) + ",,,,,,\n";
      }
    }
  }
  return csv;
}
