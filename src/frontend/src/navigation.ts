// A compendium content type and its list page.
export interface CompendiumLink {
  text: string;
  listRoute: string;
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
      { text: "Careers", listRoute: "careers" },
      { text: "Skills", listRoute: "skills" },
      { text: "Talents", listRoute: "talents" },
    ],
  },
  {
    title: "Equipment",
    links: [
      { text: "Trappings", listRoute: "items" },
      { text: "Qualities and Flaws", listRoute: "properties" },
      { text: "Runes", listRoute: "runes" },
    ],
  },
  {
    title: "Magic & Faith",
    links: [
      { text: "Spells", listRoute: "spells" },
      { text: "Prayers", listRoute: "prayers" },
    ],
  },
  {
    title: "Corruption & Creatures",
    links: [
      { text: "Mutations", listRoute: "mutations" },
      { text: "Creature Traits", listRoute: "traits" },
    ],
  },
];
