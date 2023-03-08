import { checkFloat, checkString } from "./common";

const descRe = /^[^<>]{0,10000}$/;
const invalidDesc = "This field has to be shorter than 10,000 characters and cannot use <> symbols.";
export function validWhDesc(desc) {
  return checkString(desc, descRe, invalidDesc);
}

const shortDescRe = /^[^<>]{0,200}$/;
const invalidShortDesc = "This field has to be shorter than 200 characters and cannot use <> symbols.";
export function validWhShortDesc(shortDesc) {
  return checkString(shortDesc, shortDescRe, invalidShortDesc);
}

const castingNumberRe = /^([1-9][0-9]|[0-9])$/;
const invalidCastingNumber = "Casting Number is required and has to be between 0 and 99.";
export function validWhCastingNumber(cn) {
  return checkString(cn.toString(), castingNumberRe, invalidCastingNumber);
}

const talentMaxRankRe = /^([1-9][0-9]|[0-9])$/;
const invalidTalentMaxRank = "Talent max rank is required and has to be between 0 and 99.";
export function validWhTalentMaxRank(rank) {
  return checkString(rank.toString(), talentMaxRankRe, invalidTalentMaxRank);
}

const invalidPrice = "Price is required and has to be a decimal number between 0 and 1000000000";
const minPrice = 0;
const maxPrice = 1000000000;
export function validWhItemPrice(price) {
  return checkFloat(price, minPrice, maxPrice, invalidPrice);
}

const invalidEnc = "Encumbrance is required and has to be a decimal number between 0 and 1000";
const minEnc = 0;
const maxEnc = 1000;
export function validWhItemEnc(enc) {
  return checkFloat(enc, minEnc, maxEnc, invalidEnc);
}

const dmgMultRe = /^(10|[0-9])$/;
const invalidDmgMult = "Damage Multiplier is required and has to be between 0 and 10.";
export function validWhItemDmgMult(dmgMult) {
  return checkString(dmgMult.toString(), dmgMultRe, invalidDmgMult);
}

const dmgRe = /^-?([0-9]|[1-9][0-9]|100)$/;
const invalidDmg = "Damage is required and has to be between -100 and 100.";
export function validWhItemDmg(dmg) {
  return checkString(dmg.toString(), dmgRe, invalidDmg);
}

const rngMultRe = /^(10|[0-9])$/;
const invalidRngMult = "Range Multiplier is required and has to be between 0 and 10.";
export function validWhItemRngMult(rngMult) {
  return checkString(rngMult.toString(), rngMultRe, invalidRngMult);
}

const rngRe = /^-?([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|1000)$/;
const invalidRng = "Range is required and has to be between -1000 and 1000.";
export function validWhItemRng(rng) {
  return checkString(rng.toString(), rngRe, invalidRng);
}

const apRe = /^([0-9]|[1-9][0-9]|100)$/;
const invalidAp = "Armour Points are required and have to be between 0 and 100.";
export function validWhItemAp(ap) {
  return checkString(ap.toString(), apRe, invalidAp);
}

const capRe = /^([0-9]|[1-9][0-9]|100)$/;
const invalidCap = "Capacity is required and has to be between 0 and 100.";
export function validWhItemCap(cap) {
  return checkString(cap.toString(), capRe, invalidCap);
}
