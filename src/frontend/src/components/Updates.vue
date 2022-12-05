<template>
  <div class="updates">
    <div class="container">
      <div class="text-sm-left">
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
          Hammergen now includes Gnomes from Rough Nights & Hard Days and new careers and items from Archives of the
          Empire: Volume I. We will be adding more resources soon.
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
