import { ids } from "../fixtures.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Skill } from "../../../content/skill.ts";
import { Talent } from "../../../content/talent.ts";
import { GenerationProps5e } from "../shared/generationProps.ts";

export const testSkills5e = [
  ...ids("s", 1, 22),
  ...ids("sp", 1, 8),
  "lang1",
  "lang2",
  "stealthRural",
  "stealthUrban",
].map((id) => new Skill({ id, name: id }));
testSkills5e.push(new Skill({ id: "stealth", name: "Stealth", isGroup: true }));
testSkills5e.find((x) => x.id === "stealthRural")?.group.add("stealth");
testSkills5e.find((x) => x.id === "stealthUrban")?.group.add("stealth");

export const testTalents5e = ["t1a", "t1b", "t2a", "t2b", "t3a", "t3b", "t4a", "t4b", "doomed", "rand1", "rand2"].map(
  (id) => new Talent({ id, name: id, maxRank: 1 }),
);

export const genProps5e: GenerationProps5e = {
  classItems: [{ equipped: { clothing: "1", "hood,mask": "1" }, carried: { match: "1d10" } }],
  randomTalents: [
    { id: "rand1", minRoll: 1, maxRoll: 50 },
    { id: "rand2", minRoll: 50, maxRoll: 101 },
  ],
  speciesTalents: { [SpeciesWithRegion.HumanReikland]: ["doomed", "random", "random"] },
  speciesSkills: { [SpeciesWithRegion.HumanReikland]: [...ids("sp", 1, 8), "stealth"] },
  speciesLanguages: { [SpeciesWithRegion.HumanReikland]: ["lang1", "lang2"] },
};
