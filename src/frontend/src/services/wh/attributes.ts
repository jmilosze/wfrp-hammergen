import { isKey } from "../../utils/object.ts";
import { setValidationStatus, ValidationStatus } from "../../utils/validation.ts";

export interface Attributes {
  WS: number;
  BS: number;
  S: number;
  T: number;
  I: number;
  Ag: number;
  Dex: number;
  Int: number;
  WP: number;
  Fel: number;
}

export const enum AttributeName {
  None = 0,
  WS,
  BS,
  S,
  T,
  I,
  Ag,
  Dex,
  Int,
  WP,
  Fel,
  Various,
}

export const attributeNameList = [
  AttributeName.None,
  AttributeName.WS,
  AttributeName.BS,
  AttributeName.S,
  AttributeName.T,
  AttributeName.I,
  AttributeName.Ag,
  AttributeName.Dex,
  AttributeName.Int,
  AttributeName.WP,
  AttributeName.Fel,
  AttributeName.Various,
];

export function printAttributeName(attributeName: AttributeName) {
  switch (attributeName) {
    case AttributeName.None:
      return "None";
    case AttributeName.WS:
      return "WS";
    case AttributeName.BS:
      return "BS";
    case AttributeName.S:
      return "S";
    case AttributeName.T:
      return "T";
    case AttributeName.I:
      return "I";
    case AttributeName.Ag:
      return "Ag";
    case AttributeName.Dex:
      return "Dex";
    case AttributeName.Int:
      return "Int";
    case AttributeName.WP:
      return "WP";
    case AttributeName.Fel:
      return "Fel";
    case AttributeName.Various:
      return "Various";
    default:
      return "";
  }
}

export function getAttributeValue(attributeName: AttributeName, attributes: Attributes): number {
  switch (attributeName) {
    case AttributeName.WS:
      return attributes.WS;
    case AttributeName.BS:
      return attributes.BS;
    case AttributeName.S:
      return attributes.S;
    case AttributeName.T:
      return attributes.T;
    case AttributeName.I:
      return attributes.I;
    case AttributeName.Ag:
      return attributes.Ag;
    case AttributeName.Dex:
      return attributes.Dex;
    case AttributeName.Int:
      return attributes.Int;
    case AttributeName.WP:
      return attributes.WP;
    case AttributeName.Fel:
      return attributes.Fel;
    default:
      return 0;
  }
}

export function setAttributeValue(attributeName: AttributeName, attributeValue: number, attributes: Attributes) {
  switch (attributeName) {
    case AttributeName.WS:
      attributes.WS = attributeValue;
      return;
    case AttributeName.BS:
      attributes.BS = attributeValue;
      return;
    case AttributeName.S:
      attributes.S = attributeValue;
      return;
    case AttributeName.T:
      attributes.T = attributeValue;
      return;
    case AttributeName.I:
      attributes.I = attributeValue;
      return;
    case AttributeName.Ag:
      attributes.Ag = attributeValue;
      return;
    case AttributeName.Dex:
      attributes.Dex = attributeValue;
      return;
    case AttributeName.Int:
      attributes.Int = attributeValue;
      return;
    case AttributeName.WP:
      attributes.WP = attributeValue;
      return;
    case AttributeName.Fel:
      attributes.Fel = attributeValue;
      return;
    default:
      return;
  }
}

export function zeroAttributes(): Attributes {
  return { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
}

export function sumAttributes(...args: Attributes[]): Attributes {
  const returnAtts: Attributes = { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };
  for (const attributes of args)
    for (const key of Object.keys(returnAtts)) {
      if (isKey(returnAtts, key) && isKey(attributes, key)) {
        returnAtts[key] += attributes[key];
      }
    }
  return returnAtts;
}

export function multiplyAttributes(multiplier: number, attributes: Attributes): Attributes {
  const returnAtts = copyAttributes(attributes);
  for (const key of Object.keys(returnAtts)) {
    if (isKey(attributes, key)) {
      returnAtts[key] = multiplier * attributes[key];
    }
  }
  return returnAtts;
}

export function copyAttributes(attributes: Attributes): Attributes {
  const copy: Attributes = { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 };

  for (const [key, value] of Object.entries(attributes)) {
    if (isKey(copy, key)) {
      copy[key] = value;
    }
  }

  return copy;
}

export function validAttributesFn(attributes: Attributes, min: number, max: number): ValidationStatus {
  let isValid = true;
  for (const key of Object.keys(attributes)) {
    if (isKey(attributes, key)) {
      if (attributes[key] > max || attributes[key] < min || !Number.isInteger(attributes[key])) {
        isValid = false;
        break;
      }
    } else {
      isValid = false;
      break;
    }
  }
  return setValidationStatus(
    isValid,
    `Invalid value of one or more attributes. Attributes have to be integers between ${min} and ${max}.`,
  );
}
