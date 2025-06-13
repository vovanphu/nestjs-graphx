/*
Author: Phu Vo (vovanphu1012@gmail.com)
auto-relation.decorator.ts (c) 2025
*/

import { ClassType } from '../types';
import { extractPropertyName } from '../utils';

export const AUTO_RELATION_WATERMARK = Symbol('AUTO_RELATION_WATERMARK');

export type AutoRelationType =
  | 'one-to-one'
  | 'one-to-many'
  | 'many-to-one'
  | 'many-to-many';

export interface AutoRelationOptions<R extends ClassType<any> = any> {
  type: AutoRelationType;
  target: () => R;
  name?: string;
  owner?: boolean;
  inverseSide?: (object: InstanceType<R>) => any;
  joinColumn?: string;
  joinTable?: AutoRelationJoinTable;
  nullable?: boolean;
  // relationEntity?: () => any;
  // isVirtual?: boolean;
}

export interface AutoRelationJoinTable {
  name?: string;
  joinColumn?: string;
  inverseJoinColumn?: string;
}

export interface AutoRelationMetadata<
  E extends ClassType<any>,
  R extends ClassType<any> = any,
> extends AutoRelationOptions<R> {
  entity: () => E;
}

export function AutoRelation<
  E extends ClassType<any>,
  R extends ClassType<any>,
>(options: AutoRelationOptions<R>): PropertyDecorator {
  return function (prototype: any, propertyKey: string | symbol) {
    const relations = [
      ...(Reflect.getMetadata(AUTO_RELATION_WATERMARK, prototype) || []),
    ];

    const relation = {
      ...options,
      entity: () => prototype.constructor as E,
    };

    relation.name = relation.name || propertyKey.toString();

    if (relation.type === 'many-to-one') {
      relation.owner = true; // Many-to-one is always the owner side
    }

    if (
      relation.type === 'many-to-one' ||
      (relation.type === 'one-to-one' && relation.owner)
    ) {
      relation.joinColumn =
        relation.joinColumn || propertyKey.toString() + 'Id';
    }

    if (relation.type === 'many-to-many' && relation.owner) {
      relation.joinTable = relation.joinTable || {};
      // We should not set joinTable and inverseJoinColumn here.
    }

    const isDuplicate = relations.some(
      (r: AutoRelationMetadata<E, R>) => r.name === relation.name,
    );

    if (!isDuplicate) {
      relations.push(relation);
    }

    Reflect.defineMetadata(AUTO_RELATION_WATERMARK, relations, prototype);
  };
}

export function getAutoRelations<E extends ClassType<any>>(
  target: E,
): AutoRelationMetadata<E>[] {
  return Reflect.getMetadata(AUTO_RELATION_WATERMARK, target.prototype) || [];
}

export function getAutoRelation<E extends ClassType<any>>(
  target: E,
  name: string | symbol,
): AutoRelationMetadata<E> | undefined {
  const relations = getAutoRelations(target);
  return relations.find((r) => r.name === name.toString());
}

export function getAutoRelationByJoinColumn<E extends ClassType<any>>(
  target: E,
  joinColumn: string,
): AutoRelationMetadata<E> | undefined {
  const relations = getAutoRelations(target);
  return relations.find((r) => r.joinColumn === joinColumn);
}

export function getOwnedAutoRelations<E extends ClassType<any>>(
  target: E,
): AutoRelationMetadata<E>[] {
  return getAutoRelations(target).filter((r) => r.owner);
}

export function getOwnedInverseAutoRelations<E extends ClassType<any>>(
  target: E,
  inverseEntityName?: string,
): AutoRelationMetadata<any>[] {
  const result: AutoRelationMetadata<any>[] = [];
  const ownedRelations = getOwnedAutoRelations(target);

  for (const relation of ownedRelations) {
    const relatedEntity = relation.target();

    if (inverseEntityName && relatedEntity.name !== inverseEntityName) {
      continue; // Skip relations not matching the specified related entity name
    }

    const inverseRelations = getAutoRelations(relatedEntity);

    for (const inverse of inverseRelations) {
      if (inverse.target().name !== target.name) continue;
      if (inverse.owner) continue; // Skip owned relations

      if (
        result.some(
          (r) => r.name === inverse.name && r.entity() === inverse.entity(),
        )
      ) {
        continue; // Skip duplicates
      }

      result.push(inverse);
    }
  }

  return result;
}

export function getOwnedAutoRelation<E extends ClassType<any>>(
  target: E,
  name: string | symbol,
): AutoRelationMetadata<E> | undefined {
  const relations = getOwnedAutoRelations(target);
  return relations.find((r) => r.name === name.toString());
}

export function getOwnedAutoRelationByJoinColumn<E extends ClassType<any>>(
  target: E,
  joinColumn: string,
): AutoRelationMetadata<E> | undefined {
  const relations = getOwnedAutoRelations(target);
  return relations.find((r) => r.joinColumn === joinColumn);
}

export function getOwnedInverseAutoRelation<E extends ClassType<any>>(
  target: E,
  name: string | symbol,
  inverseEntityName?: string,
): AutoRelationMetadata<any> | undefined {
  const relations = getOwnedInverseAutoRelations(target, inverseEntityName);
  return relations.find((r) => r.name === name.toString());
}

export function getOwnedInverseAutoRelationByJoinColumn<
  E extends ClassType<any>,
>(
  target: E,
  joinColumn: string,
  inverseEntityName?: string,
): AutoRelationMetadata<any> | undefined {
  const relations = getOwnedInverseAutoRelations(target, inverseEntityName);
  return relations.find((r) => r.joinColumn === joinColumn);
}

export function retrieveInverseSide(
  relation: AutoRelationMetadata<any>,
): AutoRelationMetadata<any> {
  if (relation.owner) {
    return getAutoRelations(relation.target()).find((inverse) => {
      return (
        inverse.target().name === relation.entity().name &&
        !inverse.owner &&
        extractPropertyName(inverse.inverseSide) === relation.name
      );
    });
  } else {
    return getOwnedAutoRelation(
      relation.target(),
      extractPropertyName(relation.inverseSide),
    );
  }
}
