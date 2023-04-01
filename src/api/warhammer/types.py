import enum


class ItemProperty(enum.IntEnum):
    QUALITY = 0
    FLAW = 1


class Item(enum.IntEnum):
    MELEE = 0
    RANGED = 1
    AMMO = 2
    ARMOR = 3
    CONTAINER = 4
    OTHER = 5
    GRIMOIRE = 6


class ItemAvailability(enum.IntEnum):
    COMMON = 0
    SCARCE = 1
    RARE = 2
    EXOTIC = 3


class MeleeReach(enum.IntEnum):
    PERSONAL = 0
    VERY_SHORT = 1
    SHORT = 2
    AVERAGE = 3
    LONG = 4
    VERY_LONG = 5
    MASSIVE = 6


class MeleeGroup(enum.IntEnum):
    BASIC = 0
    CAVALRY = 1
    FENCING = 2
    BRAWLING = 3
    FLAIL = 4
    PARRY = 5
    POLEARM = 6
    TWO_HANDED = 7


class RangedGroup(enum.IntEnum):
    BLACKPOWDER = 0
    BOW = 1
    CROSSBOW = 2
    ENGINEERING = 3
    ENTANGLING = 4
    EXPLOSIVES = 5
    SLING = 6
    THROWING = 7


class AmmunitionGroup(enum.IntEnum):
    BLACK_POWDER_AND_ENGINEERING = 0
    BOW = 1
    CROSSBOW = 2
    SLING = 3
    ENTANGLING = 4


class ArmorLocation(enum.IntEnum):
    ARMS = 0
    BODY = 1
    LEGS = 2
    HEAD = 3


class ArmorGroup(enum.IntEnum):
    SOFT_LEATHER = 0
    BOILED_LEATHER = 1
    MAIL = 2
    PLATE = 3
    SOFT_KIT = 4
    BRIGANDINE = 5


class Attribute(enum.IntEnum):
    NONE = 0
    WS = 1
    BS = 2
    S = 3
    T = 4
    II = 5
    AG = 6
    DEX = 7
    INT = 8
    WP = 9
    FEL = 10
    VARIOUS = 11


class Skill(enum.IntEnum):
    BASIC = 0
    ADVANCED = 1
    MIXED = 2


class StatusTier(enum.IntEnum):
    BRASS = 0
    SILVER = 1
    GOLD = 2


class StatusStanding(enum.IntEnum):
    ZERO = 0
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5
    SIX = 6
    SEVEN = 7


class CareerClass(enum.IntEnum):
    ACADEMIC = 0
    BURGHERS = 1
    COURTIER = 2
    PEASANT = 3
    RANGER = 4
    RIVERFOLK = 5
    ROGUE = 6
    WARRIOR = 7


class Species(enum.IntEnum):
    HUMAN = 0
    HALFLING = 1
    DWARF = 2
    HIGH_ELF = 3
    WOOD_ELF = 4
    GNOME = 5
    OGRE = 6


class Mutation(enum.IntEnum):
    PHYSICAL = 0
    MENTAL = 1


class Source(enum.IntEnum):
    CUSTOM = 0
    CORE = 1
    ROUGH_N_HARD = 2
    ARCHIVES_1 = 3
    ARCHIVES_2 = 4
    ARCHIVES_3 = 5
    UP_IN_ARMS = 6
    WINDS_OF_MAGIC = 7
