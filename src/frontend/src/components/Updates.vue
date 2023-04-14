<template>
  <div class="updates">
    <div class="container">
      <div class="text-sm-left">
        <div class="h3">16 Apr 2023</div>
        <p>
          We are pleased to announce addition of source property to following elements: Talents, Skills, Items,
          Qualities and Flaws, Prayers and Spells, Mutations, and Careers. It indicates which source book (for example
          "Winds of Magic") contains that particular element. Each element can have multiple sources.
        </p>
        <p>
          List of Skills, Talents, etc., can now be filtered by source and other properties (depending on the element).
          This allows to use the lists as indexes for browsing multiple source books. For example, one can look up Ogre
          Careers from Archives of the Empire Vol. II, or all Melee weapons mentioned in Up in Arms.
        </p>
        <div class="h3">05 Mar 2023</div>
        <p>
          Added contents of
          <b-link href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire-3" target="_blank"
            >Archives of the Empire: Volume III
          </b-link>
        </p>
        <ul>
          <li>New careers: 3 specialisations of Priest: Handrich, Solkan, and Rhya.</li>
          <li>New magic: Miracles of Handrich, Solkan, and Rhya. Spells from the Lore of Hedgecraft.</li>
          <li>New talents: Animal Assistant.</li>
          <li>New and updated Armour and Armour Qualities and Flaws.</li>
          <li>Rules for creation of Altdorf characters are <b>not</b> implemented, but will be added later on.</li>
        </ul>
        <div class="h3">22 Feb 2023</div>
        <p>
          Added contents of
          <b-link href="https://cubicle7games.com/wfrp-archives-of-the-empire-ii" target="_blank"
            >Archives of the Empire: Volume II
          </b-link>
        </p>
        <ul>
          <li>New careers: 3 new Ogre specific Careers: Maneater, Ogre Butcher, and Rhinox Herder.</li>
          <li>New magic: 7 new spells and a new Lore of Magic: The Lore of The Great Maw.</li>
          <li>New talents: Large and Vice.</li>
          <li>New Ogre specific weapons and armour.</li>
          <li>Siege weapons and Astrology mechanics are currently <b>not supported</b>. We will add them later on.</li>
        </ul>
        <div class="h3">12 Feb 2023</div>
        <p>
          Added contents from
          <b-link href="https://cubicle7games.com/the-winds-of-magic-wahammer-fantasy-roleplay" target="_blank"
            >Winds of Magic
          </b-link>
        </p>
        <ul>
          <li>New careers: 9 new Wizard specialisations, Mundane Alchemist, Scryer, and Beadle.</li>
          <li>New spells from 8 colours of magic, new Arcane spells, and new Ritual Magic spells.</li>
          <li>New skills: Augury, Psychometry, and Trade - Alchemy.</li>
          <li>New talents: Suffuse With - Wind, Magical Assistant.</li>
          <li>
            New items excluding Magic Potions and Cursed Items. Potions will be added later on as a new item type.
          </li>
        </ul>

        <div class="h3">10 Jan 2023</div>
        <p>
          Added contents from
          <b-link href="https://cubicle7games.com/wfrp-up-in-arms" target="_blank">Up in Arms</b-link>
          . This includes all new Items, Qualities/Flaws, Careers, new and updated Skills and Talents, and Miracles of
          Myrmidia. Things from Up in Arms that are currently not implemented in Hammergen: generation of Tilean
          characters and Siege Weapons (Catapults, Ballistas).
        </p>
        <div class="h3">17 Dec 2022</div>
        <p>
          New item type: Grimoire. You can add spells to Grimoire. When viewing character, Hammergen lists all spells in
          carried and owned Grimoires.
        </p>
        <div class="h3">5 Dec 2022</div>
        <p>
          Talents and Mutations that permanently alter <b>Attributes</b>, <b>Size</b>, or <b>Movement</b> are now
          automatically taken into account when creating and viewing character. For example if you add Talent Coolheaded
          (+5WP), it will be added to attributes and skills. As usual, you can also create your custom Talents and
          Mutations that automatically modify those characteristics. Attribute values added by Talents and Mutations are
          displayed in the "Other" row of attributes.
        </p>
        <p>
          Hammergen will automatically apply modifiers only for Talents/Mutations that modify characteristics
          permanently and in all circumstances. So for example if a Mutation gives "+10 on Perception Tests involving
          sight" it will not be applied automatically. To make sure if particular Talent/Mutation has modifiers that are
          applied automatically check description of that Talent/Mutation.
        </p>
        <p>
          If you previously manually added effect of any of the Talents that give +5 to selected attribute (for example
          Coolheaded) or Mutation that changes attributes, you might want to revert that as it is now added
          automatically.
        </p>
        <div class="h3">15 Nov 2022</div>
        <p>
          Hammergen now includes Gnomes from
          <b-link href="https://cubicle7games.com/rough-nights-hard-days" target="_blank"
            >Rough Nights & Hard Days
          </b-link>
          and new careers and items from
          <b-link href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire" target="_blank"
            >Archives of the Empire: Volume I
          </b-link>
          . We will be adding more resources soon.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdatesPage",
};
</script>

<style scoped></style>
