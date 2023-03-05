<template>
  <div class="home">
    <div class="container">
      <div class="text-center">
        <div class="display-2 title">Hammergen</div>
        <div class="title h1">A Warhammer Fantasy Roleplay character generator</div>
        <hr />
      </div>

      <div class="text-sm-left">
        <div class="alert alert-info" role="alert">
          <div class="h3">Archives of the Empire: Volume III</div>
          <p>
            We are happy to announce we contents from
            <b-link href="https://cubicle7games.com/warhammer-fantasy-roleplay-archives-of-the-empire-3" target="_blank"
              >Archives of the Empire: Volume III</b-link
            >. You can read more about this and previous updates in
            <b-link :to="{ name: 'updates' }" target="_blank">Updates</b-link>
            and on our
            <b-link
              href="https://ko-fi.com/post/Archives-of-the-Empire-Volume-III-Update-F2F5J8MI3?justpublished=true&alias=Archives-of-the-Empire-Volume-III-Update-F2F5J8MI3"
              target="_blank"
              >Ko-fi blog.
            </b-link>
          </p>
          <p>
            As always, to keep Hammergen up-to-date and add-free please consider supporting us with a small donation via
            <b-link href="https://ko-fi.com/Q5Q12E0KB" target="_blank">Ko-fi</b-link>
            :)
          </p>
        </div>

        <div class="h3">What is Hammergen?</div>
        <p>
          Hammergen is an online Warhammer Fantasy Roleplay (WFRP) 4th Edition character generator. It lets you create,
          store, and manage characters as well as custom skills, talents, etc. You can share everything you create with
          other players! To use it, you will need a Warhammer Fantasy Roleplay Rulebook and, optionally, other
          supplementary books, which you can buy from
          <a href="https://www.cubicle7games.com/our-games/warhammer-fantasy-roleplay/">Cubicle 7 store</a>.
        </p>
        <p>
          This is a second iteration of Hammergen. If you had account on the previous version (at
          <a href="https://warhammer.azurewebsites.net/">warhammer.azurewebsites.net</a>), your account and all
          characters are available here. To access this account and characters go to Login and use the “Forgot your
          password” link.
        </p>
        <div class="h3">What exactly can I do here?</div>
        <ul>
          <li>Auto-generate new level 1 characters using rulebook character creation rules</li>
          <li>Auto-generate high level characters</li>
          <li>Create custom Skills, Talents, Careers, Items, Qualities, Spells, and Mutations</li>
          <li>Share everything you create with other players.</li>
          <li>Generate names and physical descriptions using rulebook rules</li>
          <li>
            Generate random attribute rolls with one press of a button, appropriate racial bonuses are added
            automatically
          </li>
          <li>Select Skills, Talents, Weapons, Armor, Spells, and Mutations from searchable lists with descriptions</li>
          <li>Save your character and edit it later at any time</li>
          <li>View your character in a clear printable tables</li>
          <li>Download character in spreadsheet format</li>
        </ul>
        <p>
          You can see example characters (even without registering) by going to Characters in the top navigation bar.
        </p>
        <div class="h3" id="resources">Included resources</div>
        <ul>
          <li>Warhammer Fantasy Roleplay Rulebook</li>
          <li>Rough Nights & Hard Days</li>
          <li>Archives of the Empire: Volume I, II, and III</li>
          <li>Up in Arms</li>
          <li>Winds of Magic</li>
        </ul>

        <div class="h3">How do I use it?</div>
        <p>
          To start making characters you need to create an account using email address as login name. We do not verify
          the email addresses so you can use a fake email, but if you do, the password reset functionality will not
          work.
        </p>
        <p>
          After registering and logging in all you need to do is go to Characters (in top navigation bar), and click
          Create New button.
        </p>
        <p>
          Now you can also share any element you made (Character, Skill, Item, etc.) with other players! When an element
          is marked as <b>Public</b> anyone you give your username to, can see that element in read-only mode. Sharing
          is explained in the Linked Users tab in
          <b-link :to="{ name: 'manage' }" target="_blank">Manage Account</b-link>
          section.
        </p>
        <p>
          If at any point you need to roll dices, you can head over to
          <a href="https://dice.hammergen.net/">Hammergen Dice</a>
          where you can roll various RPG dices by yourself or with friends.
        </p>
        <div class="h3">About</div>
        <p>
          Hi there! Hammergen is a non-commercial hobby project run by an overworked middle-aged man. If you have any
          comments, discovered bugs, or have suggestion how to improve Hammergen, you can contact me by email:
          <a href="mailto:admin@hammergen.net">admin@hammergen.net</a>. I try to answer emails/fix bugs on the same or
          next day but sometimes life gets in the way so please be patient.
        </p>
        <p>
          If you enjoy using Hammergen, please consider supporting me on Ko-fi. Any donations will help to cover hosting
          costs.
        </p>
        <vue-kofi uid="Q5Q12E0KB" color="#353a40" text="Support Hammergen on Ko-fi" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
@font-face {
  font-family: hammergen;
  font-display: auto;
  src: url("/CaslonAntique-Bold.ttf");
}

.title {
  font-family: hammergen, serif;
}
</style>
