from schema import Schema, And, Regex, Or, Optional

from ..warhammer.types import (
    Item,
    ItemProperty,
    ItemAvailability,
    MeleeReach,
    MeleeGroup,
    RangedGroup,
    AmmunitionGroup,
    ArmorLocation,
    ArmorGroup,
    Attribute,
    Skill,
    StatusStanding,
    StatusTier,
    CareerClass,
    Species,
    Mutation,
    Source,
)

ID_SCHEMA = Regex("^[a-f0-9]{24}$")
NAME_SCHEMA = Regex("^[^<>]{0,200}$")
DESCRIPTION_SCHEMA = Regex("^[^<>]{0,100000}$")
SHORT_DESCRIPTION_SCHEMA = Regex("^[^<>]{0,200}$")
VERY_SHORT_DESCRIPTION_SCHEMA = Regex("^[^<>]{0,15}$")

CAREER_LEVEL_SCHEMA = Schema(
    {
        "name": NAME_SCHEMA,
        "status": Or(*list(StatusTier)),
        "standing": Or(*list(StatusStanding)),
        "attributes": [Or(*list(Attribute))],
        "skills": [ID_SCHEMA],
        "talents": [ID_SCHEMA],
        "items": DESCRIPTION_SCHEMA,
    }
)

ATTRIBUTES_SCHEMA = Schema(
    {
        "WS": And(int, lambda x: 99 >= x >= 0),
        "BS": And(int, lambda x: 99 >= x >= 0),
        "S": And(int, lambda x: 99 >= x >= 0),
        "T": And(int, lambda x: 99 >= x >= 0),
        "I": And(int, lambda x: 99 >= x >= 0),
        "Ag": And(int, lambda x: 99 >= x >= 0),
        "Dex": And(int, lambda x: 99 >= x >= 0),
        "Int": And(int, lambda x: 99 >= x >= 0),
        "WP": And(int, lambda x: 99 >= x >= 0),
        "Fel": And(int, lambda x: 99 >= x >= 0),
    }
)

MODIFIERS_SCHEMA = Schema(
    {
        "size": And(int, lambda x: 3 >= x >= -3),
        "movement": And(int, lambda x: 3 >= x >= -3),
        "attributes": {
            "WS": And(int, lambda x: 99 >= x >= -99),
            "BS": And(int, lambda x: 99 >= x >= -99),
            "S": And(int, lambda x: 99 >= x >= -99),
            "T": And(int, lambda x: 99 >= x >= -99),
            "I": And(int, lambda x: 99 >= x >= -99),
            "Ag": And(int, lambda x: 99 >= x >= -99),
            "Dex": And(int, lambda x: 99 >= x >= -99),
            "Int": And(int, lambda x: 99 >= x >= -99),
            "WP": And(int, lambda x: 99 >= x >= -99),
            "Fel": And(int, lambda x: 99 >= x >= -99),
        },
    },
)

SOURCE_SCHEMA = Schema({Optional(str(s)): VERY_SHORT_DESCRIPTION_SCHEMA for s in Source})

ITEM_PROPERTY_COMPONENTS = {
    "name": NAME_SCHEMA,
    "applicable_to": [*list(Item)],
    "type": Or(*list(ItemProperty)),
    "description": DESCRIPTION_SCHEMA,
    "shared": bool,
    "source": SOURCE_SCHEMA,
}

SPELL_COMPONENTS = {
    "name": NAME_SCHEMA,
    "cn": And(int, lambda x: 99 >= x >= -1),
    "range": SHORT_DESCRIPTION_SCHEMA,
    "target": SHORT_DESCRIPTION_SCHEMA,
    "duration": SHORT_DESCRIPTION_SCHEMA,
    "description": DESCRIPTION_SCHEMA,
    "shared": bool,
    "source": SOURCE_SCHEMA,
}

MUTATION_COMPONENTS = {
    "name": NAME_SCHEMA,
    "type": Or(*list(Mutation)),
    "description": DESCRIPTION_SCHEMA,
    "modifiers": MODIFIERS_SCHEMA,
    "shared": bool,
    "source": SOURCE_SCHEMA,
}

ITEM_COMPONENTS = {
    "name": NAME_SCHEMA,
    "price": lambda x: 1000000000.0 >= float(x) >= 0.0,
    "availability": Or(*list(ItemAvailability)),
    "enc": lambda x: 1000.0 >= float(x) >= 0.0,
    "description": DESCRIPTION_SCHEMA,
    "properties": [ID_SCHEMA],
    "shared": bool,
    "source": SOURCE_SCHEMA,
    "stats": Or(
        {
            "type": Item.MELEE.value,
            "hands": Or(1, 2),
            "dmg": And(int, lambda x: 100 >= x >= -100),
            "dmg_sb_mult": lambda x: 10.0 >= float(x) >= 0.0,
            "reach": Or(*list(MeleeReach)),
            "group": Or(*list(MeleeGroup)),
        },
        {
            "type": Item.RANGED.value,
            "hands": Or(1, 2),
            "dmg": And(int, lambda x: 100 >= x >= -100),
            "dmg_sb_mult": lambda x: 10.0 >= float(x) >= 0.0,
            "rng": And(int, lambda x: 10000 >= x >= -10000),
            "rng_sb_mult": lambda x: 10.0 >= float(x) >= 0.0,
            "group": Or(*list(RangedGroup)),
        },
        {
            "type": Item.AMMO.value,
            "dmg": And(int, lambda x: 100 >= x >= -100),
            "rng": And(int, lambda x: 10000 >= x >= -10000),
            "rng_mult": lambda x: 10.0 >= float(x) >= 0.0,
            "group": Or(*list(AmmunitionGroup)),
        },
        {
            "type": Item.ARMOR.value,
            "points": And(int, lambda x: 100 >= x >= 0),
            "location": [Or(*list(ArmorLocation))],
            "group": Or(*list(ArmorGroup)),
        },
        {"type": Item.CONTAINER.value, "capacity": And(int, lambda x: 1000 >= x >= 0), "wearable": bool},
        {
            "type": Item.OTHER.value,
            "carry_type": Or(
                {"carriable": True, "wearable": True},
                {"carriable": True, "wearable": False},
                {"carriable": False, "wearable": False},
            ),
        },
        {
            "type": Item.GRIMOIRE.value,
            "spells": [ID_SCHEMA],
        },
    ),
}

SKILL_COMPONENTS = {
    "name": NAME_SCHEMA,
    "description": DESCRIPTION_SCHEMA,
    "attribute": Or(*list(Attribute)),
    "type": Or(*list(Skill)),
    "is_group": bool,
    "display_zero": bool,
    "group": [ID_SCHEMA],
    "shared": bool,
    "source": SOURCE_SCHEMA,
}

TALENT_COMPONENTS = {
    "name": NAME_SCHEMA,
    "description": DESCRIPTION_SCHEMA,
    "tests": SHORT_DESCRIPTION_SCHEMA,
    "max_rank": And(int, lambda x: 99 >= x >= 0),
    "max_rank_att": Or(*list(Attribute)),
    "is_group": bool,
    "modifiers": MODIFIERS_SCHEMA,
    "group": [ID_SCHEMA],
    "shared": bool,
    "source": SOURCE_SCHEMA,
}

CAREER_COMPONENTS = {
    "name": NAME_SCHEMA,
    "description": DESCRIPTION_SCHEMA,
    "class": Or(*list(CareerClass)),
    "species": [Or(*list(Species))],
    "level_1": CAREER_LEVEL_SCHEMA,
    "level_2": CAREER_LEVEL_SCHEMA,
    "level_3": CAREER_LEVEL_SCHEMA,
    "level_4": CAREER_LEVEL_SCHEMA,
    "shared": bool,
    "source": SOURCE_SCHEMA,
}

CHARACTER_COMPONENTS = {
    "name": NAME_SCHEMA,
    "description": DESCRIPTION_SCHEMA,
    "notes": DESCRIPTION_SCHEMA,
    "equipped_items": [{"id": ID_SCHEMA, "number": And(int, lambda x: 1000 >= x >= 1)}],
    "carried_items": [{"id": ID_SCHEMA, "number": And(int, lambda x: 1000 >= x >= 1)}],
    "stored_items": [{"id": ID_SCHEMA, "number": And(int, lambda x: 1000 >= x >= 1)}],
    "skills": [{"id": ID_SCHEMA, "number": And(int, lambda x: 1000 >= x >= 1)}],
    "talents": [{"id": ID_SCHEMA, "number": And(int, lambda x: 1000 >= x >= 1)}],
    "species": Or(*list(Species)),
    "base_attributes": ATTRIBUTES_SCHEMA,
    "attribute_advances": ATTRIBUTES_SCHEMA,
    "career_path": [{"id": ID_SCHEMA, "level": And(int, lambda x: 5 >= x >= 1)}],
    "career": {"id": ID_SCHEMA, "level": And(int, lambda x: 5 >= x >= 1)},
    "fate": And(int, lambda x: 1000 >= x >= 0),
    "fortune": And(int, lambda x: 1000 >= x >= 0),
    "resilience": And(int, lambda x: 1000 >= x >= 0),
    "resolve": And(int, lambda x: 1000 >= x >= 0),
    "current_exp": And(int, lambda x: 10000000 >= x >= 0),
    "spent_exp": And(int, lambda x: 10000000 >= x >= 0),
    "status": Or(*list(StatusTier)),
    "standing": Or(*list(StatusStanding)),
    "brass": And(int, lambda x: 1000000 >= x >= 0),
    "silver": And(int, lambda x: 1000000 >= x >= 0),
    "gold": And(int, lambda x: 1000000 >= x >= 0),
    "spells": [ID_SCHEMA],
    "sin": And(int, lambda x: 1000 >= x >= 0),
    "corruption": And(int, lambda x: 1000 >= x >= 0),
    "mutations": [ID_SCHEMA],
    "shared": bool,
}

NEW_ELEM_SCHEMAS = {
    "item_property": Schema(ITEM_PROPERTY_COMPONENTS),
    "item": Schema(ITEM_COMPONENTS),
    "skill": Schema(SKILL_COMPONENTS),
    "talent": Schema(TALENT_COMPONENTS),
    "career": Schema(CAREER_COMPONENTS),
    "character": Schema(CHARACTER_COMPONENTS),
    "spell": Schema(SPELL_COMPONENTS),
    "mutation": Schema(MUTATION_COMPONENTS),
}


def convert_to_update(component):
    converted_component = {}
    for key, value in component.items():
        converted_component[Optional(key)] = value
    converted_component["id"] = ID_SCHEMA
    return converted_component


UPDATE_ELEM_SCHEMAS = {
    "item_property": Schema(convert_to_update(ITEM_PROPERTY_COMPONENTS)),
    "item": Schema(convert_to_update(ITEM_COMPONENTS)),
    "skill": Schema(convert_to_update(SKILL_COMPONENTS)),
    "talent": Schema(convert_to_update(TALENT_COMPONENTS)),
    "career": Schema(convert_to_update(CAREER_COMPONENTS)),
    "character": Schema(convert_to_update(CHARACTER_COMPONENTS)),
    "spell": Schema(convert_to_update(SPELL_COMPONENTS)),
    "mutation": Schema(convert_to_update(MUTATION_COMPONENTS)),
}
