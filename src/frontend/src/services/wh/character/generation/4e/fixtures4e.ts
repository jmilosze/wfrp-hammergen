import { ids } from "../fixtures.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Skill } from "../../../content/skill.ts";
import { Talent } from "../../../content/talent.ts";
import { GenerationProps } from "../shared/generationProps.ts";

export const testSkills4e = [...ids("s", 1, 22), ...ids("sp", 1, 8)].map((id) => new Skill({ id, name: id }));

export const testTalents4e = ["t1a", "t1b", "t2a", "t2b", "t3a", "t3b", "t4a", "t4b", "doomed", "rand1", "rand2"].map(
  (id) => new Talent({ id, name: id, maxRank: 1 }),
);

export const genProps4e: GenerationProps = {
  classItems: [{ equipped: { clothing: "1", "hood,mask": "1" }, carried: { match: "1d10" } }],
  randomTalents: [
    { id: "rand1", minRoll: 1, maxRoll: 50 },
    { id: "rand2", minRoll: 50, maxRoll: 101 },
  ],
  speciesTalents: { [SpeciesWithRegion.HumanReikland]: ["doomed", "random", "random"] },
  speciesSkills: { [SpeciesWithRegion.HumanReikland]: ids("sp", 1, 8) },
};
