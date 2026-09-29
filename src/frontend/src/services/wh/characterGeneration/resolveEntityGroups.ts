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
