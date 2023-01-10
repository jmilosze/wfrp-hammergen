<template>
  <div class="updates">
    <div class="container">
      <div class="text-sm-left">
        <div class="h3">10 Jan 2023</div>
        <p>
          Added contents from Up in
          <b-link href="https://cubicle7games.com/wfrp-up-in-arms" target="_blank">Up in Arms</b-link>. This includes
          all new Items, Qualities/Flaws, Careers, new and updated Skills and Talents, and Miracles of Myrmidia. Things
          from Up in Arms that are currently not implemented in Hammergen: generation of Tilean characters and Siege
          Weapons (Catapults, Ballistas).
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
            >Archives of the Empire: Volume I </b-link
          >. We will be adding more resources soon.
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
