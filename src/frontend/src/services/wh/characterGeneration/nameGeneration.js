import { selectRandom } from "../../../utils/randomUtils";

const HUMAN_MALE_FORENAMES = [
  "Adhemar",
  "Andres",
  "Artur",
  "Detlev",
  "Frederich",
  "Gerner",
  "Heinrich",
  "Henryk",
  "Karl",
  "Kruger",
  "Sebastien",
  "Talther",
  "Ulrich",
  "Werther",
  "Wilryn",
  "Admund",
  "Calvin",
  "Dekmar",
  "Dietrich",
  "Edgar",
  "Edwin",
  "Fosten",
  "Gismar",
  "Harman",
  "Henlyn",
  "Hugo",
  "Lutolf",
  "Manfred",
  "Oswald",
  "Reinhard",
];
const HUMAN_FEMALE_FORENAMES = [
  "Beatrijs",
  "Clementia",
  "Erika",
  "Frauke",
  "Gertraud",
  "Haletha",
  "Helga",
  "Irmina",
  "Jehanne",
  "Lorelay",
  "Marieke",
  "Sigfreda",
  "Talunda",
  "Ulrika",
  "Willelma",
  "Ada",
  "Berlinda",
  "Carlinda",
  "Drachilda",
  "Elinor",
  "Frieda",
  "Isabella",
  "Kristen",
  "Lenora",
  "Marien",
  "Olga",
  "Rosabel",
  "Sigrid",
  "Sigunda",
  "Ursula",
];
const HUMAN_SURNAMES = [
  "Bauer",
  "Fleischer",
  "Schmidt",
  "Schuster",
  "Lang",
  "Augenlos",
  "Dunn",
  "Laut",
  "Stark",
  "Muller",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Schulz",
  "Becker",
  "Hoffmann",
  "Adelhof",
  "Bacher",
  "Betz",
  "Dahmbach",
  "Durrbein",
  "Fiegler",
  "Gaertner",
  "Herzog",
  "Liess",
  "Neumann",
  "Neumann",
  "Shaumer",
  "Trachsel",
  "Widmann",
];

const HALFLING_MALE_FORENAMES = [
  "Aldebrand (Aldo)",
  "Axelbrand (Ax)",
  "Balthasar (Bally)",
  "Bartomar (Bart)",
  "Engelbrecht (Gelb)",
  "Erkenbrand (Ken)",
  "Eustasius (Tass)",
  "Ferdinand (Fred)",
  "Giselbrecht (Sel)",
  "Heironymus (Hiro)",
  "Hildemund (Hil)",
  "Konradin (Kon)",
  "Maximilian (Max)",
  "Nathandar (Nat)",
  "Nicodemus (Nick)",
  "Randulf (Randy)",
  "Sebastian (Seb)",
  "Siegmund (Siggy)",
  "Theoderic (Derek)",
  "Teodosius (Teo)",
  "Volkhard (Vee)",
];
const HALFLING_FEMALE_FORENAMES = [
  "Annabella (Bella)",
  "Antoniella (Anni)",
  "Brunhilda (Hilda)",
  "Clothilda (Clotha)",
  "Desdemona (Desde)",
  "Emagunda (Eda)",
  "Ermintrude (Mindy)",
  "Esmerelda (Esme)",
  "Friedhilda (Hilda)",
  "Grizelda (Gelda)",
  "Hildegund (Hil)",
  "Keterlyn (Lyn)",
  "Lucretia (Lucia)",
  "Maghilda (Magga)",
  "Melicent (Meli)",
  "Ottagunda (Otta)",
  "Petronella (Petra)",
  "Philomelia (Philly)",
  "Rosalinde (Rosa)",
  "Sigismunda (Sigi)",
  "Tomasina (Tina)",
  "Wilhelmina (Willa)",
];
const HALFLING_SURNAMES = [
  "Alderberry",
  "Alepuddle",
  "Appleback",
  "Barleycorn",
  "Barncock",
  "Bayleaf",
  "Bloomberry",
  "Bracebelly",
  "Braidgirdle",
  "Bramble",
  "Bunbury",
  "Burrows",
  "Catkins",
  "Churnhill",
  "Cinderhill",
  "Clinchstick",
  "Clumpthisle",
  "Codgerman",
  "Crabapple",
  "Croop",
  "Crumbuckle",
  "Crumbly",
  "Curlytoes",
  "Custard",
  "Dibbly",
  "Dibbly-Firkin",
  "Dimmock",
  "Darkwater",
  "Dogberry",
  "Downhill",
  "Downside",
  "Duckweed",
  "Fairtrot",
  "Farfield",
  "Farthingale",
  "Fastbuck",
  "Fetlock",
  "Finefettle",
  "Firkin",
  "Follyfoot",
  "Furrows",
  "Girthtree",
  "Gumbucket",
  "Guzzlewit",
  "Greenacre",
  "Greenapple",
  "Greenhill",
  "Grogbelly",
  "Grubb",
  "Grumble",
  "Harfoot",
  "Haricot",
  "Havelock",
  "Hempfire",
  "Hornblower",
  "Kettlebright",
  "Lackstern",
  "Larkspur",
  "Lilywhite",
  "Longbelt",
  "Longchalk",
  "Manglepie",
  "Marrow",
  "Meadowdown",
  "Meadowsweet",
  "Millpond",
  "Muggins",
  "Mugwort",
  "Neddly",
  "Oddfoot",
  "Overhill",
  "Patchpetal",
  "Pennyman",
  "Quickblossom",
  "Quiggly",
  "Quivergrass",
  "Rattlebone",
  "Ridgepole",
  "Riverbank",
  "Rook",
  "Rumplebreek",
  "Sandyhill",
  "Shakebelly",
  "Shufflefoot",
  "Sparrow",
  "Stonewort",
  "Tallowman",
  "Talltree",
  "Tanglefoot",
  "Thistlewood",
  "Thornpocket",
  "Tumblewine",
  "Tumpwell",
  "Whiteflower",
  "Whitethorn",
  "Widgeon",
  "Willowand",
  "Winchgirdle",
  "Windblossom",
  "Wrickleberry",
  "Ashfield",
  "Brandysnap",
  "Hayfoot",
  "Rumster",
  "Shortbottom",
  "Thorncobble",
];

const DWARF_ELEMENT_1 = [
  "Al",
  "Ath",
  "Athran",
  "Bal",
  "Bala",
  "Bara",
  "Bel",
  "Bela",
  "Ber",
  "Bok",
  "Bor",
  "Bur",
  "Da",
  "Dam",
  "Dora",
  "Drok",
  "Drong",
  "Dur",
  "Dwal",
  "El",
  "Ela",
  "Elan",
  "Elda",
  "Fa",
  "Far",
  "Fara",
  "Fim",
  "Fima",
  "Firen",
  "Fur",
  "Fura",
  "Ga",
  "Gim",
  "Gol",
  "Gollen",
  "Got",
  "Gota",
  "Grim",
  "Gro",
  "Grun",
  "Hak",
  "Haka",
  "Har",
  "Hega",
  "Hur",
  "Kad",
  "Kar",
  "Kata",
  "Kaz",
  "Kaza",
  "Krag",
  "Logaz",
  "Lok",
  "Lun",
  "Mo",
  "Mola",
  "Mor",
  "Mora",
  "No",
  "Nola",
  "Nor",
  "Noran",
  "Nun",
  "Oda",
  "Oka",
  "Olla",
  "Olf",
  "Oth",
  "Othra",
  "Ro",
  "Ror",
  "Roran",
  "Ska",
  "Skalla",
  "Skalf",
  "Skar",
  "Skor",
  "Skora",
  "Snor",
  "Snora",
  "Sven",
  "Thar",
  "Thor",
  "Thora",
  "Thron",
  "Thrun",
  "Thura",
  "Un",
  "Utha",
  "Ulla",
  "Vala",
  "Var",
  "Vara",
  "Zak",
  "Zaka",
  "Zakan",
  "Zar",
  "Zara",
  "Zam",
  "Zama",
  "Bron",
  "Dim",
  "Gud",
];

const DWARF_ELEMENT_MALE = [
  "bin",
  "bor",
  "dil",
  "din",
  "dok",
  "dor",
  "drin",
  "fin",
  "gan",
  "gar",
  "gil",
  "gin",
  "gni",
  "grom",
  "grond",
  "groth",
  "grum",
  "grund",
  "grunt",
  "gon",
  "gor",
  "grim",
  "grin",
  "gul",
  "gun",
  "gund",
  "ki",
  "kin",
  "krag",
  "kri",
  "krin",
  "li",
  "lin",
  "lik",
  "lok",
  "lun",
  "min",
  "mir",
  "nin",
  "nir",
  "rag",
  "ri",
  "rig",
  "rik",
  "rin",
  "run",
  "skin",
  "tin",
  "tok",
  "trek",
  "trok",
  "zin",
  "zor",
  "zad",
  "tri",
];

const DWARF_ELEMENT_FEMALE = [
  "bina",
  "bora",
  "dila",
  "dina",
  "dokina",
  "dora",
  "drinella",
  "fina",
  "fya",
  "gana",
  "gara",
  "gella",
  "gina",
  "groma",
  "grondella",
  "grotha",
  "gruma",
  "grunda",
  "gruntina",
  "gona",
  "gora",
  "grimella",
  "grina",
  "gromina",
  "gula",
  "gunella",
  "gundina",
  "kina",
  "kragella",
  "krina",
  "kya",
  "lina",
  "likina",
  "loka",
  "luna",
  "mina",
  "mira",
  "nina",
  "nira",
  "nya",
  "ragina",
  "riga",
  "rika",
  "rina",
  "runa",
  "runella",
  "skina",
  "skinella",
  "tina",
  "toka",
  "trekella",
  "trekina",
  "troka",
  "zina",
  "zora",
  "da",
  "na",
];

const DWARF_NICKNAMES = [
  "Blackhand",
  "Axebringer",
  "Finehand",
  "Forkbread",
  "Ironbraid",
  "Redhammer",
  "Stonefist",
  "Ironfist",
  "Redaxe",
  "Longbreard",
  "Hammersmith",
  "Runesmith",
  "Ironbrow",
  "Redbrow",
  "Grudgebearer",
  "Lawbringer",
  "Frostaxe",
  "Frosthammer",
  "Frostbrow",
  "Sunbraid",
  "Frostbeard",
];

const DWARF_NICKNAME_PROB = 0.2;

const HIGH_ELF_SURNAMES = [
  "Emberfall",
  "Fireborn",
  "Foamheart",
  "Goldenhair",
  "Silverspray",
  "Spellsign",
  "Bluefeather",
  "Bravestar",
  "Brightcrown",
  "Brightknife",
  "Brightwand",
  "Coolwater",
  "Darkmoon",
  "Eldendrake",
  "Fastblade",
  "Hawkstar",
  "Keeneye",
  "Keensight",
  "Palewand",
  "Purelight",
  "Shadowstar",
  "Sharpblade",
  "Starfire",
  "Silverhair",
  "Swiftwing",
  "Youngstar",
];

const WOOD_ELF_SURNAMES = [
  "Fleetriver",
  "Shadowstalker",
  "Treeshaper",
  "Weavewatcher",
  "Willowlimb",
  "Windrunner",
  "Blackwood",
  "Boldheart",
  "Boldspear",
  "Bravehelm",
  "Coolstream",
  "Darkeagle",
  "Fleetfoot",
  "Gladwind",
  "Goodroot",
  "Greendale",
  "Greenfeather",
  "Greenglade",
  "Lightfoot",
  "Shadowhelm",
  "Slendertree",
  "Soaringleaf",
  "Strongarrow",
  "Silverleaf",
  "Swiftbow",
  "Youngleaf",
];

const ELF_ELEMENT_1 = ["Aes", "Ath", "Dor", "Far", "Gal", "Im", "Lin", "Mal", "Mor", "Ullia"];
const ElF_ELEMENT_2 = ["a", "ath", "dia", "en", "for", "lor", "mar", "ol", "sor", "than"];
const HIGH_ELF_ENDINGS = ["andril", "anel", "ellion", "fin", "il", "irian", "mor", "nil", "ric", "wing"];
const WOOD_ELF_ENDINGS = ["arha", "anhu", "dda", "han", "loc", "noc", "oth", "ryn", "stra", "wyth"];

// gender: 0 male, 1 female, 2 any

function generateElfName(species) {
  let endingsTable = species === 3 ? HIGH_ELF_ENDINGS : WOOD_ELF_ENDINGS;
  let surnameTable = species === 3 ? HIGH_ELF_SURNAMES : WOOD_ELF_SURNAMES;
  let forename = selectRandom(ELF_ELEMENT_1) + selectRandom(ElF_ELEMENT_2) + selectRandom(endingsTable);
  return forename + " " + selectRandom(surnameTable);
}

function generateDwarfName(gender) {
  let elementTables = [DWARF_ELEMENT_MALE, DWARF_ELEMENT_FEMALE];
  let forename = selectRandom(DWARF_ELEMENT_1) + selectRandom(elementTables[gender]);

  let surname;
  if (Math.random() < DWARF_NICKNAME_PROB) {
    surname = selectRandom(DWARF_NICKNAMES);
  } else {
    let ancestor_gender = selectRandom([0, 1]);
    let ancForename = selectRandom(DWARF_ELEMENT_1) + selectRandom(elementTables[ancestor_gender]);
    let suffix = gender === 0 ? selectRandom(["sson", "snev"]) : selectRandom(["sdottir", "sniz"]);
    surname = ancForename + suffix;
  }
  return forename + " " + surname;
}

function generateHumanHalflingName(species, gender) {
  let forenameTables = [HUMAN_MALE_FORENAMES, HUMAN_FEMALE_FORENAMES];
  let surnameTable = HUMAN_SURNAMES;

  if (species === 1) {
    forenameTables = [HALFLING_MALE_FORENAMES, HALFLING_FEMALE_FORENAMES];
    surnameTable = HALFLING_SURNAMES;
  }

  let surname = selectRandom(surnameTable);
  let forename = selectRandom(forenameTables[gender]);
  return forename + " " + surname;
}

export default function generateName(species, gender) {
  let selected_gender = gender;
  if (gender === 2) {
    selected_gender = Math.floor(Math.random() * 2);
  }

  if (species === 0 || species === 1) {
    return generateHumanHalflingName(species, selected_gender);
  } else if (species === 2) {
    return generateDwarfName(selected_gender);
  } else {
    return generateElfName(species);
  }
}
