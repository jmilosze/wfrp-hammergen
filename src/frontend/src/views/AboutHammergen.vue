<script setup lang="ts">
import Header from "../components/PageHeader.vue";
import TextLink from "../components/TextLink.vue";
</script>

<template>
  <Header title="About Hammergen" />
  <div class="text-2xl font-semibold mt-5">The author</div>
  <p>
    Hi there! Hammergen is a non-commercial hobby project run by an overworked middle-aged man. If you have any
    comments, discovered bugs, or have any suggestions on how to improve Hammergen, you can contact me by email:
    <TextLink href="mailto:admin@hammergen.net">admin@hammergen.net</TextLink>. I try to answer emails/fix bugs on the
    same or next day but sometimes life gets in the way so please be patient.
  </p>

  <div class="text-2xl font-semibold mt-5">Source books</div>
  <p>Hammergen includes contents from the following source books:</p>
  <ul class="list-disc ml-6 mt-1">
    <li>Warhammer Fantasy Roleplay Rulebook</li>
    <li>Rough Nights & Hard Days</li>
    <li>Archives of the Empire: Volume I, II, and III</li>
    <li>Up in Arms</li>
    <li>Winds of Magic</li>
    <li>Middenheim City of the White Wolf</li>
    <li>Salzenmund, City of Salt and Silver</li>
    <li>Sea of Claws</li>
    <li>Lustria</li>
    <li>Enemy in Shadows</li>
    <li>Enemy in Shadows Companion</li>
    <li>Death on the Reik Companion</li>
    <li>Starter Set</li>
    <li>Ubersreik Adventures</li>
    <li>Ubersreik Adventures 2</li>
    <li>Altdorf - Crown of the Empire</li>
    <li>The Imperial Zoo</li>
    <li>Reikland Miscellanea</li>
    <li>Tribes and Tribulations</li>
  </ul>

  <div class="text-2xl font-semibold mt-5">Updates</div>

  <div>
    <div class="text-xl mt-2 mb-1">22 Oct 2024</div>
    <p class="mb-1">Added Creature ~150 traits. Creature traits can be attached to any character.</p>
  </div>

  <div>
    <div class="text-xl mt-2 mb-1">9 Jun 2024</div>
    <p class="mb-1">
      Added contents of
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-tribes-and-tribulations" target="_blank">
        Tribes and Tribulations
      </TextLink>
    </p>
  </div>

  <div>
    <div class="text-xl mt-2 mb-1">6 Jun 2024</div>
    <p>
      Added spell types and labels and the ability to filter by them. For example, a spell can have type of "Lore spell"
      and labels "Ritual", "Lore of Light", and "Lore of Heavens". When filtering, this spell will show up if you filter
      for "Ritual" or "Lore of Light" or "Lore of Heavens".
    </p>
    <p>
      Some of the buttons, like "View/Edit" or "Create New" are now proper links. This means it is possible to right
      click on them and "open in new tab".
    </p>
  </div>

  <div>
    <div class="text-xl mt-2 mb-1">25 May 2024</div>
    <p>Added hardy effect to talents and mutations.</p>
    <p class="mb-1">
      Added contents of
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-reikland-miscellanea" target="_blank">
        Reikland Miscellanea
      </TextLink>
    </p>
  </div>

  <div>
    <div class="text-xl mt-2 mb-1">21 Apr 2024</div>
    <p>Redesigned page layout and changed colour scheme. No changes to functionality.</p>
  </div>

  <div>
    <div class="text-xl mt-2 mb-1">19 Nov 2023</div>
    <p class="mb-1">Added contents of:</p>
    <ul class="list-disc ml-6 mt-1">
      <li>
        <TextLink href="https://cubicle7games.com/warhammer-fantasy-starter-set" target="_blank">Starter Set </TextLink>
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/ubersreik-adventures" target="_blank">Ubersreik Adventures </TextLink>
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/ubersreik-adventures-ii" target="_blank">
          Ubersreik Adventures 2
        </TextLink>
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/wfrp-altdorf-crown-of-the-empire" target="_blank">
          Altdorf - Crown of the Empire
        </TextLink>
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/wfrp-the-imperial-zoo" target="_blank">The Imperial Zoo</TextLink>
      </li>
    </ul>

    <div class="text-xl mt-2 mb-1">5 Oct 2023</div>
    <p>Added filter by group to Trappings.</p>
    <p>Added new Item property type (in addition to Quality and Flaw): Dwarf Rune.</p>
    <p class="mb-1">Added all skills, talents, items, spells, etc. from all remaining Enemy Within Campaign books:</p>
    <ul class="list-disc ml-6 mt-1">
      <li>
        <TextLink
          href="https://cubicle7games.com/enemy-within-campaign-volume-3-power-behind-the-throne"
          target="_blank"
        >
          Power Behind the Throne
        </TextLink>
      </li>
      <li>
        <TextLink
          href="https://cubicle7games.com/enemy-within-campaign-volume-3-power-behind-the-throne-companion"
          target="_blank"
        >
          Power Behind the Throne Companion
        </TextLink>
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/enemy-within-campaign-volume-4-the-horned-rat" target="_blank">
          The Horned Rat
        </TextLink>
      </li>
      <li>
        <TextLink
          href="https://cubicle7games.com/enemy-within-campaign-volume-4-the-horned-rat-companion"
          target="_blank"
        >
          The Horned Rat Companion
        </TextLink>
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/enemy-within-campaign-volume-5-the-empire-in-ruins" target="_blank">
          Empire in Ruins
        </TextLink>
      </li>
      <li>
        <TextLink
          href="https://cubicle7games.com/enemy-within-campaign-volume-5-the-empire-in-ruins-companion"
          target="_blank"
        >
          Empire in Ruins Companion
        </TextLink>
      </li>
    </ul>
    <div class="text-xl mt-2 mb-1">14 Sep 2023</div>
    <p>
      Spells and Prayers are now split into separate properties. Character has now list of spells and list of prayers.
    </p>
    <div class="text-xl mt-2 mb-1">3 Sep 2023</div>
    <p>
      Added talents, spells, Warrior of Tzeentch career, herbs and other items from
      <TextLink href="https://cubicle7games.com/enemy-within-campaign-volume-2-death-on-the-reik" target="_blank">
        Death on the Reik
      </TextLink>
      <TextLink
        href="https://cubicle7games.com/enemy-within-campaign-volume-2-death-on-the-reik-companion"
        target="_blank"
      >
        Death on the Reik Companion
      </TextLink>
    </p>
    <div class="text-xl mt-2 mb-1">28 Aug 2023</div>
    <p>
      Added mutations, talents, spells, and Cult Magus of Tzeentch career from
      <TextLink href="https://cubicle7games.com/enemy-within-campaign-volume-1-enemy-in-shadows" target="_blank">
        Enemy in Shadows
      </TextLink>
      and
      <TextLink
        href="https://cubicle7games.com/enemy-within-campaign-volume-1-enemy-in-shadows-companion"
        target="_blank"
      >
        Enemy in Shadows Companion
      </TextLink>
    </p>
    <div class="text-xl mt-2 mb-1">21 Aug 2023</div>
    <p>
      Added careers and weapons from
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-lustria" target="_blank">Lustria</TextLink>
    </p>
    <div class="text-xl mt-2 mb-1">14 May 2023</div>
    <p>
      Added generation rules for halfling clans from
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire" target="_blank">
        Archives of the Empire: Volume I
      </TextLink>
    </p>
    <div class="text-xl mt-2 mb-1">02 May 2023</div>
    <p class="mb-1">Added generation rules (Talents, Skills, and names) from the following books:</p>
    <ul class="list-disc ml-6 mt-1">
      <li>
        <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire-3" target="_blank">
          Archives of the Empire: Volume III
        </TextLink>
        Human (Altdorf South Bank), Human (Altdorf Eastend), Human (Altdorf Hexxerbezrik), Human (Altdorf Docklands),
        Dwarf (Atldorf)
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/wfrp-middenheim-city-of-the-white-wolf" target="_blank">
          Middenheim City of the White Wolf,
        </TextLink>
        Human (Middenheim), Human (Middenland), Human (Nordland)
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/wfrp-salzenmund-city-of-salt-and-silver" target="_blank">
          Salzenmund, City of Salt and Silver,
        </TextLink>
        Human (Salzenmund), Dwarf (Cragforge Clan), Dwarf (Grumsson Clan)
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-sea-of-claws" target="_blank">
          Sea of Claws.
        </TextLink>
        Human (Nors Bjornling), Human (Norse Sarl), Human (Norse Skaeling), Dwarf (Norse)
      </li>
      <li>
        <TextLink href="https://cubicle7games.com/wfrp-up-in-arms" target="_blank">Up in Arms</TextLink>
        Human (Tilea)
      </li>
    </ul>
    <div class="text-xl mt-2 mb-1">24 Apr 2023</div>
    <p>
      Added careers from
      <TextLink href="https://cubicle7games.com/wfrp-middenheim-city-of-the-white-wolf" target="_blank">
        Middenheim City of the White Wolf,
      </TextLink>

      <TextLink href="https://cubicle7games.com/wfrp-salzenmund-city-of-salt-and-silver" target="_blank">
        Salzenmund, City of Salt and Silver,
      </TextLink>
      and
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-sea-of-claws" target="_blank">
        Sea of Claws.
      </TextLink>
    </p>
    <p>
      Because of extra complexity from adding multiple careers and random career tables, we have temporarily disabled
      generation of characters with random species/career. You can still auto-generate level 1 characters but you have
      to select species and career.
    </p>
    <div class="text-xl mt-2 mb-1">16 Apr 2023</div>
    <p>
      We are pleased to announce addition of source property to following elements: Talents, Skills, Items, Qualities
      and Flaws, Prayers and Spells, Mutations, and Careers. It indicates which source book (for example "Winds of
      Magic") contains that particular element. Each element can have multiple sources.
    </p>
    <p>
      List of Skills, Talents, etc., can now be filtered by source and other properties (depending on the element). This
      allows to use the lists as indexes for browsing multiple source books. For example, one can look up Ogre Careers
      from Archives of the Empire Vol. II, or all Melee weapons mentioned in Up in Arms.
    </p>
    <div class="text-xl mt-2 mb-1">05 Mar 2023</div>
    <p class="mb-1">
      Added contents of
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire-3" target="_blank">
        Archives of the Empire: Volume III
      </TextLink>
    </p>
    <ul class="list-disc ml-6 mt-1">
      <li>New careers: 3 specialisations of Priest: Handrich, Solkan, and Rhya.</li>
      <li>New magic: Miracles of Handrich, Solkan, and Rhya. Spells from the Lore of Hedgecraft.</li>
      <li>New talents: Animal Assistant.</li>
      <li>New and updated Armour and Armour Qualities and Flaws.</li>
      <li>Rules for creation of Altdorf characters are <b>not</b> implemented, but will be added later on.</li>
    </ul>
    <div class="text-xl mt-2 mb-1">22 Feb 2023</div>
    <p class="mb-1">
      Added contents of
      <TextLink href="https://cubicle7games.com/wfrp-archives-of-the-empire-ii" target="_blank">
        Archives of the Empire: Volume II
      </TextLink>
    </p>
    <ul class="list-disc ml-6 mt-1">
      <li>New careers: 3 new Ogre specific Careers: Maneater, Ogre Butcher, and Rhinox Herder.</li>
      <li>New magic: 7 new spells and a new Lore of Magic: The Lore of The Great Maw.</li>
      <li>New talents: Large and Vice.</li>
      <li>New Ogre specific weapons and armour.</li>
      <li>Siege weapons and Astrology mechanics are currently <b>not supported</b>. We will add them later on.</li>
    </ul>
    <div class="text-xl mt-2 mb-1">12 Feb 2023</div>
    <p class="mb-1">
      Added contents from
      <TextLink href="https://cubicle7games.com/the-winds-of-magic-wahammer-fantasy-roleplay" target="_blank">
        Winds of Magic
      </TextLink>
    </p>
    <ul class="list-disc ml-6 mt-1">
      <li>New careers: 9 new Wizard specialisations, Mundane Alchemist, Scryer, and Beadle.</li>
      <li>New spells from 8 colours of magic, new Arcane spells, and new Ritual Magic spells.</li>
      <li>New skills: Augury, Psychometry, and Trade - Alchemy.</li>
      <li>New talents: Suffuse With - Wind, Magical Assistant.</li>
      <li>New items excluding Magic Potions and Cursed Items. Potions will be added later on as a new item type.</li>
    </ul>

    <div class="text-xl mt-2 mb-1">10 Jan 2023</div>
    <p>
      Added contents from
      <TextLink href="https://cubicle7games.com/wfrp-up-in-arms" target="_blank">Up in Arms</TextLink>
      . This includes all new Items, Qualities/Flaws, Careers, new and updated Skills and Talents, and Miracles of
      Myrmidia. Things from Up in Arms that are currently not implemented in Hammergen: generation of Tilean characters
      and Siege Weapons (Catapults, Ballistas).
    </p>
    <div class="text-xl mt-2 mb-1">17 Dec 2022</div>
    <p>
      New item type: Grimoire. You can add spells to Grimoire. When viewing character, Hammergen lists all spells in
      carried and owned Grimoires.
    </p>
    <div class="text-xl mt-2 mb-1">5 Dec 2022</div>
    <p>
      Talents and Mutations that permanently alter <b>Attributes</b>, <b>Size</b>, or <b>Movement</b> are now
      automatically taken into account when creating and viewing character. For example if you add Talent Coolheaded
      (+5WP), it will be added to attributes and skills. As usual, you can also create your custom Talents and Mutations
      that automatically modify those characteristics. Attribute values added by Talents and Mutations are displayed in
      the "Other" row of attributes.
    </p>
    <p>
      Hammergen will automatically apply modifiers only for Talents/Mutations that modify characteristics permanently
      and in all circumstances. So for example if a Mutation gives "+10 on Perception Tests involving sight" it will not
      be applied automatically. To make sure if particular Talent/Mutation has modifiers that are applied automatically
      check description of that Talent/Mutation.
    </p>
    <p>
      If you previously manually added effect of any of the Talents that give +5 to selected attribute (for example
      Coolheaded) or Mutation that changes attributes, you might want to revert that as it is now added automatically.
    </p>
    <div class="text-xl mt-2 mb-1">15 Nov 2022</div>
    <p>
      Hammergen now includes Gnomes from
      <TextLink href="https://cubicle7games.com/rough-nights-hard-days" target="_blank">
        Rough Nights & Hard Days
      </TextLink>
      and new careers and items from
      <TextLink href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire" target="_blank">
        Archives of the Empire: Volume I
      </TextLink>
      . We will be adding more resources soon.
    </p>
  </div>
</template>

<style scoped></style>
