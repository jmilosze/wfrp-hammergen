export const enum SourceBook {
  Custom = 0,
  WFRP,
  RoughNights,
  Archives1,
  Archives2,
  Archives3,
  UpInArms,
  WindsOfMagic,
  Middenheim,
  Salzenmund,
  SeaOfClaws,
  Lustria,
  EnemyInShadowsCompanion,
  DeathOnTheReikCompanion,
  EnemyInShadows,
  DeathOnTheReik,
  PowerBehindTheThrone,
  PowerBehindTheThroneCompanion,
  TheHornedRat,
  TheHornedRatCompanion,
  EmpireInRuins,
  EmpireInRuinsCompanion,
  TheImperialZoo,
  Altdorf,
  UbersreikAdventures1,
  UbersreikAdventures2,
  GuideToUbersreik,
  AdventureBook,
}

export function printSourceBook(sourceBook: SourceBook) {
  switch (sourceBook) {
    case SourceBook.Custom:
      return "Custom";
    case SourceBook.WFRP:
      return "WFRP";
    case SourceBook.RoughNights:
      return "Rough Nights & Hard Days";
    case SourceBook.Archives1:
      return "Archives Volume I";
    case SourceBook.Archives2:
      return "Archives Volume II";
    case SourceBook.Archives3:
      return "Archives Volume III";
    case SourceBook.UpInArms:
      return "Up in Arms";
    case SourceBook.WindsOfMagic:
      return "Winds of Magic";
    case SourceBook.Middenheim:
      return "Middenheim";
    case SourceBook.Salzenmund:
      return "Salzenmund";
    case SourceBook.SeaOfClaws:
      return "Sea of Claws";
    case SourceBook.Lustria:
      return "Lustria";
    case SourceBook.EnemyInShadowsCompanion:
      return "Enemy in Shadows Companion";
    case SourceBook.DeathOnTheReikCompanion:
      return "Death on the Reik Companion";
    case SourceBook.EnemyInShadows:
      return "Enemy in Shadows";
    case SourceBook.DeathOnTheReik:
      return "Death on the Reik";
    case SourceBook.PowerBehindTheThrone:
      return "Power Behind the Throne";
    case SourceBook.PowerBehindTheThroneCompanion:
      return "Power Behind the Throne Companion";
    case SourceBook.TheHornedRat:
      return "The Horned Rat";
    case SourceBook.TheHornedRatCompanion:
      return "The Horned Rat Companion";
    case SourceBook.EmpireInRuins:
      return "Empire in Ruins";
    case SourceBook.EmpireInRuinsCompanion:
      return "Empire in Ruins Companion";
    case SourceBook.TheImperialZoo:
      return "The Imperial Zoo";
    case SourceBook.Altdorf:
      return "Altdorf Crown of the Empire";
    case SourceBook.UbersreikAdventures1:
      return "Ubersreik Adventures";
    case SourceBook.UbersreikAdventures2:
      return "Ubersreik Adventures 2";
    case SourceBook.GuideToUbersreik:
      return "Guide to Ubersreik (Starter Set)";
    case SourceBook.AdventureBook:
      return "Adventure Book (Starter Set)";
    default:
      return "None";
  }
}

export type Source = Record<string, SourceBook>;

export function defaultSource(): Source {
  return { 0: "" };
}

export function copySource(source: Source) {
  return JSON.parse(JSON.stringify(source));
}
