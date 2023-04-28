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
    SEAFARER = 8


class Species(enum.Enum):
    HUMAN = "0000"
    HUMAN_REIKLAND = "0001"  # WFRP p. 25
    HUMAN_ALTDORF_SOUTH_BANK = "0002"  # Archives III p. 83
    HUMAN_ALTDORF_EASTEND = "0003"  # Archives III p. 83
    HUMAN_ALTDORF_HEXXERBEZRIK = "0004"  # Archives III p. 84
    HUMAN_ALTDORF_DOCKLANDS = "0005"  # Archives III p. 84
    HUMAN_MIDDENHEIM = "0006"  # Middenheim p. 151
    HUMAN_MIDDENLAND = "0007"  # Middenheim p. 152, Salzenmund p. 142
    HUMAN_NORDLAND = "0008"  # Middenheim p. 153
    HUMAN_SALZENMUND = "0009"  # Salzenmund p. 142
    HUMAN_TILEA = "0010"  # Up in Arms p. 55
    HUMAN_NORSE_BJORNLING = "0011"  # Sea of Claws p. 56
    HUMAN_NORSE_SARL = "0012"  # Sea of Claws p. 56
    HUMAN_NORSE_SKAELING = "0013"  # Sea of Claws p. 56
    HALFLING_DEFAULT = "0100"  # WFRP p. 26
    DWARF_DEFAULT = "0200"  # WFRP p. 25
    DWARF_ALTDORF = "0201"  # Archives III p. 83
    DWARF_CRAGFORGE_CLAN = "0202"  # Salzenmund p. 142
    DWARF_GRUMSSON_CLAN = "0203"  # Salzenmund p. 142
    DWARF_NORSE = "0204"  # Sea of Claws p. 41
    HIGH_ELF_DEFAULT = "0300"  # WFRP p. 27
    WOOD_ELF_DEFAULT = "0400"  # WFRP p. 28
    GNOME_DEFAULT = "0500"  # Rough Nights and Hard Days p. 86
    OGRE_DEFAULT = "0600"  # Archives II p. 18


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
    MIDDENHEIM = 8
    SALZENMUND = 9
    SEA_OF_CLAWS = 10
    LUSTRIA = 11
