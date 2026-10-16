import { printSkillType, Skill, skillTypeList } from "@/services/wh/content/skill.ts";
import { attributeNameList, printAttributeName } from "@/services/wh/core/attributes.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of skills; the types and characteristics some skill has are offered.
export const skillFilters = {
  type: {
    title: "Type",
    options: (list) => {
      const typesInData = new Set(list.map((wh) => wh.type));
      return skillTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printSkillType(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.type.toString()),
  },
  attribute: {
    title: "Characteristic",
    options: (list) => {
      const attributesInData = new Set(list.map((wh) => wh.attribute));
      return attributeNameList
        .filter((x) => attributesInData.has(x))
        .map((x) => ({ text: printAttributeName(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.attribute.toString()),
  },
  source: sourceFilter(true),
} satisfies ContentFilters<Skill>;
