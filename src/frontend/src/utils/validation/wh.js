import { checkString } from "./common";

const nameRe = /^[^<>]{0,200}$/;
export function validWhName(name) {
  return checkString(name, "Name", nameRe, "Name has to be shorter than 200 characters and cannot use <> symbols.");
}

const descRe = /^[^<>]{0,10000}$/;
export function validWhDesc(name) {
  return checkString(name, "Description", descRe, "Description has to shorter than 10,000 characters and cannot use <> symbols.");
}