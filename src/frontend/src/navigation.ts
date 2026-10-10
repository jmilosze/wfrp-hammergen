import type { RouteRecordNameGeneric } from "vue-router";

// A compendium content type: its list page and its editor page.
export interface CompendiumLink {
  text: string;
  listRoute: string;
  editRoute: string;
}

// Compendium content types grouped under a sub-heading.
export interface CompendiumSection {
  title: string;
  links: CompendiumLink[];
}

export const COMPENDIUM_SECTIONS: CompendiumSection[] = [
  {
    title: "Careers & Skills",
    links: [
      { text: "Careers", listRoute: "careers", editRoute: "career" },
      { text: "Skills", listRoute: "skills", editRoute: "skill" },
      { text: "Talents", listRoute: "talents", editRoute: "talent" },
    ],
  },
  {
    title: "Equipment",
    links: [
      { text: "Trappings", listRoute: "items", editRoute: "item" },
      { text: "Qualities and flaws", listRoute: "properties", editRoute: "property" },
      { text: "Runes", listRoute: "runes", editRoute: "rune" },
    ],
  },
  {
    title: "Magic & Faith",
    links: [
      { text: "Spells", listRoute: "spells", editRoute: "spell" },
      { text: "Prayers", listRoute: "prayers", editRoute: "prayer" },
    ],
  },
  {
    title: "Corruption & Creatures",
    links: [
      { text: "Mutations", listRoute: "mutations", editRoute: "mutation" },
      { text: "Creature traits", listRoute: "traits", editRoute: "trait" },
    ],
  },
];

export const CHARACTER_ROUTES = ["characters", "character", "viewCharacter"];

export function isCompendiumRoute(name: RouteRecordNameGeneric): boolean {
  return COMPENDIUM_SECTIONS.some((section) =>
    section.links.some((link) => link.listRoute === name || link.editRoute === name),
  );
}
