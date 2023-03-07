import { checkString } from "./common";

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
  return checkString(cn, castingNumberRe, invalidCastingNumber);
}

const talentMaxRankRe = /^([1-9][0-9]|[0-9])$/;
const invalidTalentMaxRank = "Talent max rank is required and has to be between 0 and 99.";
export function validWhTalentMaxRank(rank) {
  return checkString(rank, talentMaxRankRe, invalidTalentMaxRank);
}
