import { Source, sourceForEdition, updateSource } from "./source.ts";
import { ValidationStatus } from "../../../utils/validation.ts";
import { cloneEntity } from "../../../utils/clone.ts";
import { isEqualEntity } from "../../../utils/equal.ts";
import { Edition } from "./edition.ts";

export enum Visibility {
  Private = 0,
  Shared = 1,
  Public = 2,
}

export interface WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  source: Source;

  copy: <T extends WhProperty>(this: T) => T;
  forEdition(edition: Edition): this;
  // isValid checks the model as the variant of the given edition.
  isValid: (edition: Edition) => boolean;
  validateName: () => ValidationStatus;
  validateDescription: () => ValidationStatus;
  isEqualTo: (other: unknown) => boolean;
  updateSource: (update: { id: string; notes: string; selected: boolean }) => void;
}

export abstract class WhEntity implements WhProperty {
  id: string;
  ownerId: string;
  visibility: Visibility;
  name: string;
  description: string;
  source: Source;

  protected constructor({
    id = "",
    ownerId = "",
    visibility = Visibility.Private,
    name = "",
    description = "",
    source = {},
  }: {
    id?: string;
    ownerId?: string;
    visibility?: Visibility;
    name?: string;
    description?: string;
    source?: Source;
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.visibility = visibility;
    this.name = name;
    this.description = description;
    this.source = source;
  }

  copy<T extends WhEntity>(this: T): T {
    return cloneEntity(this);
  }

  // forEdition returns a copy to start the edition's variant from (pre-filled from this variant).
  // Types with edition-specific rules adjust it further.
  forEdition(edition: Edition): this {
    const variant = this.copy();
    variant.source = sourceForEdition(this.source, edition);
    return variant;
  }

  isEqualTo(other: unknown): boolean {
    return isEqualEntity(this, other);
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  abstract isValid(edition: Edition): boolean;
  abstract validateName(): ValidationStatus;
  abstract validateDescription(): ValidationStatus;
}
