// Group skills and talents: indexing members by group and picking concrete members.
import { SelectRandomFn } from "../../../../../utils/random.ts";

export type EntityGroupMap = Record<string, string[]>;

export interface GroupableEntity {
  id: string;
  group?: Iterable<string>;
}

/**
 * Indexes entities by their group identifiers (e.g. 'melee' -> ['melee_basic', 'melee_brawling']).
 */
export function resolveEntityGroups<T extends GroupableEntity>(entities: T[]): EntityGroupMap {
  const resolvedGroups: EntityGroupMap = {};

  for (const entity of entities) {
    if (entity.group) {
      for (const group of entity.group) {
        if (group in resolvedGroups) {
          resolvedGroups[group].push(entity.id);
        } else {
          resolvedGroups[group] = [entity.id];
        }
      }
    }
  }
  return resolvedGroups;
}

/**
 * Picks concrete members of groups (e.g. 'melee' -> 'melee_basic').
 * Each picker owns a copy of the group map, and every member it draws is removed from that copy,
 * so the same picker never returns the same member of a group twice.
 */
export class GroupPicker {
  private readonly remainingMembers: EntityGroupMap;
  private readonly selectRandomFn: SelectRandomFn;

  constructor(groupMap: EntityGroupMap, selectRandomFn: SelectRandomFn) {
    this.remainingMembers = Object.fromEntries(
      Object.entries(groupMap).map(([group, members]) => [group, [...members]]),
    );
    this.selectRandomFn = selectRandomFn;
  }

  isGroup(id: string): boolean {
    return id in this.remainingMembers;
  }

  /**
   * Draws random remaining members of the group until one is found that is not in `excluded`.
   * Returns null when the group runs out of members.
   */
  pick(group: string, excluded: string[]): string | null {
    while (this.remainingMembers[group].length > 0) {
      const member = this.selectRandomFn(this.remainingMembers[group]);
      this.remainingMembers[group] = this.remainingMembers[group].filter((m) => m !== member);
      if (!excluded.includes(member)) {
        return member;
      }
    }
    return null;
  }
}
